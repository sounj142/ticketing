import { NextFunction, Request, Response } from 'express';
import { JwtHelper, UserPayload } from '../utils/jwt-helper';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export function getCurrentUser(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  if (req.session?.jwt) {
    const { jwt } = req.session;
    req.currentUser = JwtHelper.verifyToken(jwt);
  }
  if (!req.currentUser) {
    const authorizationHearder = req.headers.authorization;
    if (authorizationHearder?.startsWith('Bearer ')) {
      const jwt = authorizationHearder.substring(7).trimStart();
      req.currentUser = JwtHelper.verifyToken(jwt);
    }
  }

  next();
}
