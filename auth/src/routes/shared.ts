import { JwtHelper } from '@hoangrepo/common';
import { Request } from 'express';

export function generateJwtToken(userDoc: any, req: Request) {
  const userJwt = JwtHelper.createToken({
    id: userDoc.id,
    email: userDoc.email,
  });

  req.session = { jwt: userJwt };
}
