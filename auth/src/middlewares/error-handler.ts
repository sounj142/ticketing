import { NextFunction, Request, Response } from 'express';
import { isDevelopmentEnv } from '../utils/config';
import { BaseError, CommonErrorStructure } from '../errors/base-error';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof BaseError) {
    res.status(err.statusCode).send(err.getCommonErrorStructure());
  } else {
    const errorData: CommonErrorStructure = {
      errors: [{ message: 'Something went wrong.' }],
    };
    if (isDevelopmentEnv)
      (errorData as any).devOnly = { ...err, message: err.message };

    console.error(err);
    res.status(500).send(errorData);
  }
}
