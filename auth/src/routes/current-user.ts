import { callMongoDb, getCurrentUser } from '@hoangorg/common';
import { Router, Request, Response } from 'express';
import User from '../models/user';

const router = Router();

router.get(
  '/api/users/currentuser',
  getCurrentUser,
  async (req: Request, res: Response) => {
    if (req.currentUser?.id) {
      const user = await callMongoDb(() =>
        User.findOne({ _id: req.currentUser!.id }).exec()
      );
      if (user) {
        res.json({ id: user._id, email: user.email });
        return;
      }
    }
    res.json(null);
  }
);

export default router;
