import { authentication } from '@hoangrepo/common';
import express, { Request, Response } from 'express';
import { OrderModel } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders',
  authentication,
  async (req: Request, res: Response) => {
    const orders = await OrderModel.find({ userId: req.currentUser!.id });
    res.send(orders);
  }
);

export default router;
