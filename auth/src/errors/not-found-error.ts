import { BaseError } from './base-error';

export class NotFoundError extends BaseError {
  statusCode = 404;

  constructor(public errorId?: string, message: string = 'Not Found.') {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }], errorId: this.errorId };
  }
}
