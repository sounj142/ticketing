export interface CommonErrorStructure {
  errors: { message: string; field?: string }[];
  errorId?: string;
}

export abstract class BaseError extends Error {
  abstract statusCode: number;
  abstract errorId?: string;

  constructor(message?: string) {
    super(message);

    // only because we're extending a built in class
    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract getCommonErrorStructure(): CommonErrorStructure;
}
