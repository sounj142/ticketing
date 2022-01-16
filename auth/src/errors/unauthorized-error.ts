import ApplicationError from './application-error';

export default class UnauthorizedError extends ApplicationError {
  statusCode = 401;

  constructor(message: string = 'Unauthorized') {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }] };
  }
}
