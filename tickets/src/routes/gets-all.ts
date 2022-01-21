import express, { Request, Response } from 'express';
import { getCurrentUser, authentication } from '@hoangrepo/common';

const router = express.Router();

router.get(
  '/api/tickets',
  getCurrentUser,
  authentication,
  (req: Request, res: Response) => {
    // res.json((req as any).currentUser || null);
    res.send({ aa: 'aaaa' });
  }
);

export default router;
