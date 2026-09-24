import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService';
import { CreateBookingDTO } from '../types/booking';

export const bookingController = {
  async getBookings(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.query.userId as string | undefined;
      const bookings = await bookingService.getBookings(userId);
      res.json(bookings);
    } catch (err) {
      next(err);
    }
  },

  async getBookingsByRoom(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { roomId } = req.params;
      const bookings = await bookingService.getBookingsByRoom(roomId);
      res.json(bookings);
    } catch (err) {
      next(err);
    }
  },

  async getBookingById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBookingById(id);
      res.json(booking);
    } catch (err) {
      next(err);
    }
  },

  async createBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: CreateBookingDTO = req.body;
      const created = await bookingService.createBooking(dto);
      res.status(201).json(created);
    } catch (err) {
      next(err);
    }
  },

  async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const cancelled = await bookingService.cancelBooking(id);
      res.json(cancelled);
    } catch (err) {
      next(err);
    }
  },
};

