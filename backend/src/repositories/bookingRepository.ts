import { db } from '../database/db';
import { Booking, BookingStatus } from '../types/booking';

export const bookingRepository = {
  async findAll(userId?: string): Promise<Booking[]> {
    let list = [...db.getBookings()];
    if (userId) {
      list = list.filter((b) => b.userId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async findByRoom(roomId: string, status?: BookingStatus): Promise<Booking[]> {
    let list = db.getBookings().filter((b) => b.roomId === roomId);
    if (status) {
      list = list.filter((b) => b.status === status);
    }
    return list;
  },

  async findById(id: string): Promise<Booking | null> {
    const list = db.getBookings();
    const found = list.find((b) => b.id === id);
    return found ? { ...found } : null;
  },

  async create(booking: Booking): Promise<Booking> {
    const list = db.getBookings();
    const updated = [booking, ...list];
    await db.saveBookings(updated);
    return booking;
  },

  async updateStatus(id: string, status: BookingStatus): Promise<Booking | null> {
    const list = db.getBookings();
    const index = list.findIndex((b) => b.id === id);
    if (index === -1) return null;

    const updatedBooking: Booking = {
      ...list[index],
      status,
    };

    list[index] = updatedBooking;
    await db.saveBookings(list);
    return updatedBooking;
  },
};

