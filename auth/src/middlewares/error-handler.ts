import { NextFunction, Request, Response } from 'express';
import ApplicationError from '../errors/application-error';

export default function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApplicationError) {
    res.status(err.statusCode).send(err.getCommonErrorStructure());
  } else {
    console.log(err);
    res.status(500).send({ errors: [{ message: 'Something went wrong!' }] });
  }
}
