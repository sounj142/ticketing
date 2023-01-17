import { Request } from 'express';
import { UserDoc } from '../models/user';
import { jwtExpiresIn, refreshExpiresIn } from '../utils/config';
import { JwtHelper } from '../utils/jwt-helper';

interface LoginResult {
  id: string;
  email: string;
  token?: string;
  refreshToken?: string;
}

export function generateJwtToken(
  user: UserDoc,
  req: Request,
  dontUseCookie: boolean
) {
  const userJwt = JwtHelper.createToken(
    {
      id: user.id,
      email: user.email,
    },
    jwtExpiresIn
  );

  let result: LoginResult;
  if (dontUseCookie) {
    const refreshToken = JwtHelper.createToken(
      {
        id: user.id,
        email: user.email,
        __v: user.__v,
      },
      refreshExpiresIn
    );

    result = {
      id: user.id,
      email: user.email,
      token: userJwt,
      refreshToken,
    };
  } else {
    req.session = { jwt: userJwt };
    result = {
      id: user.id,
      email: user.email,
    };
  }

  return result;
}
