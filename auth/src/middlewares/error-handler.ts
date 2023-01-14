import { NextFunction, Request, Response } from 'express';
import { isDevelopmentEnv } from '../config';
import { BaseError } from '../errors/base-error';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof BaseError) {
    res.status(err.statusCode).send(err.getCommonErrorStructure());
  } else {
    console.error(err);
    const message = isDevelopmentEnv ? err.message : 'Something went wrong.';
    res.status(500).send({ errors: [{ message: message }] });
  }
}
