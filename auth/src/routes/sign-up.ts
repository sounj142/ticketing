import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import validateRequest from '../middlewares/validate-request';

const router = Router();

const signUpValidators = [
  body('email').isEmail().withMessage('Email must be a valid email.'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must have at least 6 characters.'),
];

router.post(
  '/api/users/signup',
  signUpValidators,
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    res.send('signup!');
  }
);

export default router;
