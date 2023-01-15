import { BaseError } from './base-error';

export class UnauthorizedError extends BaseError {
  statusCode = 401;

  constructor(public errorId?: string, message: string = 'Unauthorized.') {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }], errorId: this.errorId };
  }
}
