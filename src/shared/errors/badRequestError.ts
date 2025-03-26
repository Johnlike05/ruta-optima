// src/shared/errors/bad-request-error.ts
export class BadRequestError extends Error {
    constructor(public message: string, public details?: any[]) {
      super(message);
      this.name = 'BadRequestError';
    }
  }