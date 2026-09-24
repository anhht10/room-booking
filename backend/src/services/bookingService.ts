import { bookingRepository } from '../repositories/bookingRepository';
import { roomRepository } from '../repositories/roomRepository';
import { Booking, CreateBookingDTO } from '../types/booking';
import { BadRequestError, ConflictError, NotFoundError } from '../types/api';
import {
  getOverallTimeRange,
  intervalsOverlap,
  sortTimeSlots,
} from '../utils/intervalOverlap';
import { parseSlotInterval, timeStringToMinutes } from '../utils/date';

export const bookingService = {
  async getBookings(userId?: string): Promise<Booking[]> {
    return bookingRepository.findAll(userId);
  },

  async getBookingsByRoom(roomId: string): Promise<Booking[]> {
    return bookingRepository.findByRoom(roomId, 'CONFIRMED');
  },

  async getBookingById(id: string): Promise<Booking> {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError(`Booking with ID "${id}" was not found`);
    }
    return booking;
  },

  /**
   * Core server-side atomic conflict prevention engine
   */
  async createBooking(dto: CreateBookingDTO): Promise<Booking> {
    // 1. Validate basic input
    if (!dto.roomId) throw new BadRequestError('Room ID is required');
    if (!dto.userId) throw new BadRequestError('User ID is required');
    if (!dto.date) throw new BadRequestError('Booking date is required');
    if (!dto.slots || dto.slots.length === 0) {
      throw new BadRequestError('Please select at least one time slot');
    }

    // 2. Validate room existence
    const room = await roomRepository.findById(dto.roomId);
    if (!room) {
      throw new NotFoundError(`Room "${dto.roomId}" does not exist`);
    }

    // 3. Validate operating hours
    const sortedSlots = sortTimeSlots(dto.slots);
    const roomOpenMin = timeStringToMinutes(room.openingTime);
    const roomCloseMin = timeStringToMinutes(room.closingTime);

    for (const slot of sortedSlots) {
      const { startMinutes, endMinutes } = parseSlotInterval(slot);
      if (startMinutes < roomOpenMin || endMinutes > roomCloseMin) {
        throw new BadRequestError(
          `Slot ${slot} is outside operating hours (${room.openingTime} - ${room.closingTime})`
        );
      }
    }

    // 4. Check for conflicts with existing CONFIRMED bookings on the same date
    const existingBookings = await bookingRepository.findByRoom(dto.roomId, 'CONFIRMED');
    const sameDateBookings = existingBookings.filter((b) => b.date === dto.date);

    for (const slot of sortedSlots) {
      const { startMinutes, endMinutes } = parseSlotInterval(slot);

      for (const existing of sameDateBookings) {
        const existingStart = timeStringToMinutes(existing.startTime);
        const existingEnd = timeStringToMinutes(existing.endTime);

        if (intervalsOverlap(startMinutes, endMinutes, existingStart, existingEnd)) {
          throw new ConflictError(
            `Time slot ${slot} is no longer available. It conflicts with existing reservation ${existing.id} (${existing.startTime} - ${existing.endTime}).`
          );
        }
      }
    }

    // 5. Construct new confirmed booking
    const { startTime, endTime } = getOverallTimeRange(sortedSlots);
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const newBooking: Booking = {
      id: `BK-${randomSuffix}`,
      roomId: room.id,
      roomName: room.name,
      roomType: room.type,
      building: room.building,
      floor: room.floor,
      roomNumber: room.roomNumber,
      userId: dto.userId,
      date: dto.date,
      startTime,
      endTime,
      slots: sortedSlots,
      status: 'CONFIRMED',
      purpose: dto.purpose || 'General Academic Study',
      createdAt: new Date().toISOString(),
    };

    return bookingRepository.create(newBooking);
  },

  async cancelBooking(id: string): Promise<Booking> {
    const booking = await bookingRepository.findById(id);
    if (!booking) {
      throw new NotFoundError(`Booking with ID "${id}" was not found`);
    }

    if (booking.status === 'CANCELLED') {
      throw new BadRequestError('This booking is already cancelled');
    }

    const updated = await bookingRepository.updateStatus(id, 'CANCELLED');
    if (!updated) {
      throw new NotFoundError(`Failed to update booking status for ID "${id}"`);
    }

    return updated;
  },
};

