import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import AuthError from '../error-code';
import User from '../models/user';
import { generateJwtToken } from './shared';
import {
  BadRequestError,
  callMongoDb,
  Password,
  validateRequest,
} from '@hoangorg/common';

const router = Router();

const signInValidators = [
  body('email')
    .toLowerCase()
    .isEmail()
    .withMessage('Email must be a valid email.'),
  body('password').notEmpty().withMessage('Password is required.'),
];
const defaultErrorMessage = `Invalid email or password.`;

router.post(
  '/api/users/signin',
  signInValidators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;

    // check if user already exists
    const user = await callMongoDb(() => User.findOne({ email }).exec());
    if (!user) {
      throw new BadRequestError(AuthError.Auth0002, defaultErrorMessage);
    }

    const passwordMatch = await Password.isCorrect(user.password, password);
    if (!passwordMatch) {
      throw new BadRequestError(AuthError.Auth0002, defaultErrorMessage);
    }

    const dontUseCookie = req.query.dontUseCookie === 'true';
    const authResult = generateJwtToken(user, req, dontUseCookie);

    console.log(`User '${email}' logged in successfully`);
    res.status(200).send(authResult);
  }
);

export default router;
