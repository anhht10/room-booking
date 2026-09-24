import { httpClient } from './httpClient';
import { USE_REAL_BACKEND } from '../config/api';
import { INITIAL_BOOKINGS, INITIAL_ROOMS } from './mockData';
import { Booking, CreateBookingPayload } from '../types/booking';
import { ApiError, BookingConflictError } from '../types/api';
import { getOverallTimeRange, hasBookingConflict, sortTimeSlots } from '../utils/booking';

// In-memory bookings database fallback
let bookingsDatabase: Booking[] = [...INITIAL_BOOKINGS];

export const bookingsApi = {
  /**
   * Fetches all bookings, optionally filtered by user ID
   */
  async getBookings(userId?: string): Promise<Booking[]> {
    if (USE_REAL_BACKEND) {
      try {
        const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
        return await httpClient<Booking[]>(`/bookings${query}`);
      } catch (err) {
        console.warn('[bookingsApi] Real backend getBookings failed, falling back to mock:', err);
      }
    }

    let list = [...bookingsDatabase];
    if (userId) {
      list = list.filter((b) => b.userId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  /**
   * Fetches all bookings for a specific room (needed for checking slot availability)
   */
  async getBookingsByRoom(roomId: string): Promise<Booking[]> {
    if (USE_REAL_BACKEND) {
      try {
        return await httpClient<Booking[]>(`/rooms/${roomId}/bookings`);
      } catch (err) {
        console.warn(`[bookingsApi] Real backend getBookingsByRoom failed for room ${roomId}:`, err);
      }
    }

    return bookingsDatabase.filter((b) => b.roomId === roomId && b.status === 'CONFIRMED');
  },

  /**
   * Fetches a single booking by ID
   */
  async getBookingById(id: string): Promise<Booking> {
    if (USE_REAL_BACKEND) {
      try {
        return await httpClient<Booking>(`/bookings/${id}`);
      } catch (err) {
        console.warn(`[bookingsApi] Real backend getBookingById failed for ${id}:`, err);
      }
    }

    const found = bookingsDatabase.find((b) => b.id === id);
    if (!found) {
      throw new ApiError(`Booking with ID "${id}" was not found`, 404);
    }
    return { ...found };
  },

  /**
   * Creates a new booking with strict server-side conflict detection.
   * Throws BookingConflictError if any requested slot overlaps an active booking.
   */
  async createBooking(payload: CreateBookingPayload): Promise<Booking> {
    if (USE_REAL_BACKEND) {
      // NOTE: We do NOT catch conflict errors here so the UI can display the server's 409 message
      return await httpClient<Booking>('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    }

    // Mock Fallback Logic
    const room = INITIAL_ROOMS.find((r) => r.id === payload.roomId);
    if (!room) {
      throw new ApiError('Selected room does not exist', 404);
    }

    if (!payload.slots || payload.slots.length === 0) {
      throw new ApiError('Please select at least one time slot to book', 400);
    }

    // Conflict detection
    const isConflicted = hasBookingConflict(
      {
        roomId: payload.roomId,
        date: payload.date,
        slots: payload.slots,
      },
      bookingsDatabase
    );

    if (isConflicted) {
      throw new BookingConflictError('This time slot is no longer available. Please select another slot.');
    }

    const sortedSlots = sortTimeSlots(payload.slots);
    const { startTime, endTime } = getOverallTimeRange(sortedSlots);

    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      roomId: room.id,
      roomName: room.name,
      roomType: room.type,
      building: room.building,
      floor: room.floor,
      roomNumber: room.roomNumber,
      userId: payload.userId,
      date: payload.date,
      startTime,
      endTime,
      slots: sortedSlots,
      status: 'CONFIRMED',
      purpose: payload.purpose || 'General Academic Study',
      createdAt: new Date().toISOString(),
    };

    bookingsDatabase = [newBooking, ...bookingsDatabase];
    return newBooking;
  },

  /**
   * Cancels an existing booking
   */
  async cancelBooking(id: string): Promise<Booking> {
    if (USE_REAL_BACKEND) {
      return await httpClient<Booking>(`/bookings/${id}/cancel`, {
        method: 'PATCH',
      });
    }

    const index = bookingsDatabase.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new ApiError(`Booking "${id}" was not found`, 404);
    }

    const target = bookingsDatabase[index];
    if (target.status === 'CANCELLED') {
      throw new ApiError('This booking is already cancelled', 400);
    }

    const updatedBooking: Booking = {
      ...target,
      status: 'CANCELLED',
    };

    bookingsDatabase[index] = updatedBooking;
    return updatedBooking;
  },
};
