export interface CommonErrorStructure {
  errors: { message: string; field?: string }[];
}

export default abstract class ApplicationError extends Error {
  abstract statusCode: number;

  constructor(message?: string) {
    super(message);

    // only because we're extending a built in class
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }

  abstract getCommonErrorStructure(): CommonErrorStructure;
}
