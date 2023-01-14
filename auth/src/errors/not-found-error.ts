import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  statusCode = 404;
  errorId?: string;

  constructor(message: string = 'Not Found.', errorId?: string) {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
    this.errorId = errorId;
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }], errorId: this.errorId };
  }
}
