import { Request } from 'express';
import { UserDoc } from '../models/user';
import { JwtHelper } from '../utils/jwt-helper';

export function generateJwtToken(user: UserDoc, req: Request) {
  const userJwt = JwtHelper.createToken({
    id: user.id,
    email: user.email,
  });

  const dontUseCookie = req.query.dontUseCookie === 'true';
  const result = {
    id: user.id,
    email: user.email,
    jwt: dontUseCookie ? userJwt : undefined,
  };
  if (!dontUseCookie) req.session = { jwt: userJwt };

  return result;
}
