import { Exception } from "../../../shared/exceptions/Exceptions";
import { Response } from "./response";

export class Result {
  static ok<T>(data?: T): Response<T | null> {
    return {
      isError: false,
      data: data || null,
      timestamp: new Date(),
    };
  }

  static failure<E extends Exception>(exception: E): never {
    throw exception;
  }
}