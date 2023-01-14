import { BaseError } from './base-error';

export class DatabaseConnectionError extends BaseError {
  statusCode = 500;

  constructor(
    public errorId?: string,
    message: string = 'Error connecting to database.'
  ) {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }], errorId: this.errorId };
  }
}
