import ApplicationError from './application-error';

export default class NotFoundError extends ApplicationError {
  statusCode = 404;

  constructor(message: string = 'Not Found') {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }] };
  }
}
