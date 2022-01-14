import { ValidationError } from 'express-validator';
import ApplicationError from './application-error';

export default class RequestValidationError extends ApplicationError {
  statusCode = 400;

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
