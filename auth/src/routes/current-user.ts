import express, { Request, Response } from 'express';
import getCurrentUser from '../middlewares/get-current-user';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  getCurrentUser,
  (req: Request, res: Response) => {
    res.json((req as any).currentUser || null);
  }
);

export default router;
