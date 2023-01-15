import { BaseError } from './base-error';

export class ForbiddenError extends BaseError {
  statusCode = 403;

  constructor(public errorId?: string, message: string = 'Forbidden') {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }], errorId: this.errorId };
  }
}
