import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { isTestEnvironment } from '../env';
import { BadRequestError, validateRequest } from '@hoangrepo/common';
import { UserModel } from '../models/user';
import { Password } from '../services/password';
import { generateJwtToken } from './shared';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    // check if user already exists
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new BadRequestError(`Invalid email or password`);
    }

    if (!(await Password.isCorrect(user.passwordHash, password))) {
      throw new BadRequestError(`Invalid email or password`);
    }

    generateJwtToken(user, req);

    !isTestEnvironment && console.log(`User '${email}' logged in successfully`);
    res.status(200).send(user);
  }
);

export default router;
