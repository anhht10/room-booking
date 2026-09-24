export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 400) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'This time slot is no longer available.') {
    super(message, 409);
    this.name = 'ConflictError';
  }
}

export class BadRequestError extends AppError {
  constructor(message: string = 'Bad request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

