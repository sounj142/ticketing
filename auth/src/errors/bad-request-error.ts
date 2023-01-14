import { BaseError } from './base-error';

export class BadRequestError extends BaseError {
  statusCode = 400;

  constructor(public errorId?: string, message?: string) {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }], errorId: this.errorId };
  }
}
