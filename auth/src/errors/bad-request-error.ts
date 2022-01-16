import ApplicationError from './application-error';

export default class BadRequestError extends ApplicationError {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }] };
  }
}
