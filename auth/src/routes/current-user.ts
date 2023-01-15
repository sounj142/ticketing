import { Router, Request, Response } from 'express';
import { getCurrentUser } from '../middlewares/get-current-user';
import User from '../models/user';
import callMongoDb from '../utils/call-mongo';

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
