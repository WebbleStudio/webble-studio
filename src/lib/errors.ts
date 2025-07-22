/**
 * Centralized error handling utilities
 * Provides consistent error formatting and logging across the application
 */

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EMAIL_ERROR = 'EMAIL_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: unknown;
  timestamp: string;
}

export class ApplicationError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApplicationError';
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Creates a standardized error response for API routes
 */
export function createErrorResponse(error: ApplicationError, status: number) {
  return Response.json(
    {
      error: error.toJSON(),
      success: false,
    },
    { status }
  );
}

/**
 * Logs errors in a structured format
 */
export function logError(error: ApplicationError | Error, context?: string) {
  const errorData = {
    timestamp: new Date().toISOString(),
    context,
    error:
      error instanceof ApplicationError
        ? error.toJSON()
        : {
            name: error.name,
            message: error.message,
            stack: error.stack,
          },
  };

  console.error('Application Error:', JSON.stringify(errorData, null, 2));
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Sanitizes user input
 */
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
