import { Router } from 'express';
import { roomController } from '../controllers/roomController';
import { bookingController } from '../controllers/bookingController';

export const roomRouter = Router();

roomRouter.get('/', roomController.getRooms);
roomRouter.get('/:id', roomController.getRoomById);
roomRouter.get('/:roomId/bookings', bookingController.getBookingsByRoom);

