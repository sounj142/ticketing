import { ValidationError } from 'express-validator';
import { BaseError } from './base-error';

export class RequestValidationError extends BaseError {
  statusCode = 400;
  errorId?: string = undefined;

  constructor(private errors: ValidationError[]) {
    super();
    // only because we're extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public getCommonErrorStructure() {
    return {
      errors: this.errors.map((x) => ({
        message: x.msg,
        field: x.param,
      })),
    };
  }
}
