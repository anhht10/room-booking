import { Request, Response, NextFunction } from 'express';
import { AppError } from '../types/api';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.name,
      message: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  console.error('[Unhandled Error]', err);
  res.status(500).json({
    error: 'InternalServerError',
    message: err.message || 'An unexpected server error occurred',
    statusCode: 500,
  });
}

