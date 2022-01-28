import { NotFoundError, MongoHelper, authentication, ForbiddenError } from '@hoangrepo/common';
import express, { Request, Response } from 'express';
import { OrderModel } from '../models/order';

const router = express.Router();

router.get(
  '/api/orders/:id',
  authentication,
  async (req: Request, res: Response) => {
    const id = MongoHelper.parseObjectIdAndThrowNotFound(req.params.id);

    const order = await OrderModel.findById(id).populate('ticket');
    if (!order) {
      throw new NotFoundError('Order does not exist');
    }
    if (order.userId !== req.currentUser!.id) {
      throw new ForbiddenError();
    }

    res.send(order);
  }
);

export default router;
