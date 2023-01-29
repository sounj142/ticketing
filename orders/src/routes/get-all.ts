import { authentication } from '@hoangorg/common';
import express, { Request, Response } from 'express';
import Order from '../models/order';

const router = express.Router();

router.get(
  '/api/orders',
  authentication,
  async (req: Request, res: Response) => {
    const orders = await Order.find({
      userId: req.currentUser!.id,
    }).populate('ticket');

    res.json(orders);
  }
);

export default router;
