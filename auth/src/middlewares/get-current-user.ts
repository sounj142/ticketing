import { NextFunction, Request, Response } from 'express';
import { JwtHelper, UserPayload } from '../services/jwt-helper';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export default function getCurrentUser(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.session?.jwt) {
    const { jwt } = req.session;
    req.currentUser = JwtHelper.verifyToken(jwt);
  }
  next();
}
