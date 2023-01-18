import {
  BadRequestError,
  callMongoDb,
  isTestEnvironment,
  JwtHelper,
} from '@hoangorg/common';
import { Router, Request, Response } from 'express';
import AuthError from '../error-code';
import User from '../models/user';
import { generateJwtToken } from './shared';

const router = Router();

router.post('/api/users/refresh-token', async (req: Request, res: Response) => {
  const { refreshToken }: { refreshToken: string } = req.body;
  if (!refreshToken)
    throw new BadRequestError(AuthError.Auth0003, 'Invalid refresh token.');

  const tokenInfo = JwtHelper.verifyToken(refreshToken);
  if (!tokenInfo?.email)
    throw new BadRequestError(
      AuthError.Auth0003,
      'Refresh token invalid or expired.'
    );

  // check if user already exists
  const user = await callMongoDb(() =>
    User.findOne({ email: tokenInfo.email }).exec()
  );
  if (!user) throw new BadRequestError(AuthError.Auth0004, 'User not found.');

  if (user.__v !== tokenInfo.__v)
    throw new BadRequestError(
      AuthError.Auth0005,
      'User credentials has changed.'
    );

  const authResult = generateJwtToken(user, req, true);

  !isTestEnvironment &&
    console.log(`Generate new token for user '${user.email}' successfully`);
  res.status(200).send(authResult);
});

export default router;
