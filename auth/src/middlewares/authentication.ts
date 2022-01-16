import { NextFunction, Request, Response } from 'express';
import UnauthorizedError from '../errors/unauthorized-error';

export default function authentication(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (!req.currentUser?.id) {
    throw new UnauthorizedError();
  }
  next();
}
