import { BaseError } from './base-error';

export class DatabaseConnectionError extends BaseError {
  statusCode = 500;
  errorId?: string;

  constructor(
    message: string = 'Error connecting to database.',
    errorId?: string
  ) {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    this.errorId = errorId;
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }] };
  }
}
