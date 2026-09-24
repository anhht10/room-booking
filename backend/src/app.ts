import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import { roomRouter } from './routes/roomRoutes';
import { bookingRouter } from './routes/bookingRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { requestLogger } from './middlewares/logger';

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(cors({ origin: '*' }));
  app.use(express.json());
  app.use(requestLogger);

  // Health-check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Campus Booking API',
      timestamp: new Date().toISOString(),
    });
  });

  // REST API Routes
  app.use('/api/rooms', roomRouter);
  app.use('/api/bookings', bookingRouter);

  // Central error handling
  app.use(errorHandler);

  return app;
}

