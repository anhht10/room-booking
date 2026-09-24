export class ApiError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'ApiError';
  }
}

export class BookingConflictError extends ApiError {
  constructor(message: string = 'This time slot is no longer available.') {
    super(message, 409);
    this.name = 'BookingConflictError';
  }
}

