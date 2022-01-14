import ApplicationError from './application-error';

export default class DatabaseConnectionError extends ApplicationError {
  statusCode = 500;

  constructor(message: string = 'Error connecting to database') {
    super(message);
    // only because we're extending a built in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public getCommonErrorStructure() {
    return { errors: [{ message: this.message }] };
  }
}
