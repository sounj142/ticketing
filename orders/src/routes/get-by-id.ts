import {
  NotFoundError,
  authentication,
  ForbiddenError,
  parseObjectIdAndThrowNotFound,
} from '@hoangorg/common';
import express, { Request, Response } from 'express';
import Order from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:id',
  authentication,
  async (req: Request, res: Response) => {
    const notFoundMsg = 'Order does not exist.';
    const id = parseObjectIdAndThrowNotFound(req.params.id, notFoundMsg);

    const order = await Order.findById(id).populate('ticket');
    if (!order) {
      throw new NotFoundError(notFoundMsg);
    }

    if (order.userId !== req.currentUser!.id) {
      throw new ForbiddenError();
    }

    res.json(order);
  }
);

export default router;
