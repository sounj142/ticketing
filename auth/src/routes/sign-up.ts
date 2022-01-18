import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { isTestEnvironment } from '../env';
import BadRequestError from '../errors/bad-request-error';
import DatabaseConnectionError from '../errors/database-connection-error';
import validateRequest from '../middlewares/validate-request';
import { UserModel, User } from '../models/user';
import { Password } from '../services/password';
import { generateJwtToken } from './shared';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password }: { email: string; password: string } = req.body;
    // check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestError(`Email ${email} has already been in use`);
    }

    const passwordHash = await Password.toHash(password);
    // save new user to mongodb
    const userDoc = new UserModel<User>({
      email,
      passwordHash,
    });
    try {
      await userDoc.save();
    } catch (err) {
      console.error(err);
      throw new DatabaseConnectionError();
    }

    generateJwtToken(userDoc, req);

    !isTestEnvironment && console.log(`Created user '${userDoc.email}'`);
    res.status(201).send(userDoc);
  }
);

export default router;
