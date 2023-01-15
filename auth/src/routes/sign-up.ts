import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import AuthError from '../error-code';
import { BadRequestError } from '../errors/bad-request-error';
import validateRequest from '../middlewares/validate-request';
import User from '../models/user';
import callMongoDb from '../utils/call-mongo';
import { Password } from '../utils/password';
import { generateJwtToken } from './shared';

const router = Router();

const signUpValidators = [
  body('email')
    .toLowerCase()
    .isEmail()
    .withMessage('Email must be a valid email.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must have at least 6 characters.'),
];

router.post(
  '/api/users/signup',
  signUpValidators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;

    const passwordHash = await Password.toHash(password);
    const user = User.build({ email, password: passwordHash });

    await callMongoDb(
      () => user.save(),
      (err) => {
        if (err.code === 11000)
          throw new BadRequestError(
            AuthError.Auth0001,
            `Email ${email} has already been in use.`
          );
      }
    );

    const authResult = generateJwtToken(user, req);

    console.log(`Created user '${user.email}'`);
    res.status(201).send(authResult);
  }
);

export default router;
