import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';

export const bookingRouter = Router();

bookingRouter.get('/', bookingController.getBookings);
bookingRouter.get('/:id', bookingController.getBookingById);
bookingRouter.post('/', bookingController.createBooking);
bookingRouter.patch('/:id/cancel', bookingController.cancelBooking);

