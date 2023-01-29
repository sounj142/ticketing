import express, { Request, Response } from 'express';
import {
  authentication,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  OrderStatus,
  parseObjectIdAndThrowNotFound,
  callMongoDb,
} from '@hoangorg/common';
import Order from '../models/order';
import { getOrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  authentication,
  async (req: Request, res: Response) => {
    const notFoundMessage = 'Order does not exist.';
    const id = parseObjectIdAndThrowNotFound(req.params.id, notFoundMessage);

    const order = await Order.findById(id).populate('ticket');
    if (!order) {
      throw new NotFoundError(notFoundMessage);
    }
    if (order.userId !== req.currentUser!.id) {
      throw new ForbiddenError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('This order has already been cacelled.');
    }

    order.status = OrderStatus.Cancelled;
    await callMongoDb(() => order.save());

    await getOrderCancelledPublisher().publish({
      id: order.id,
      status: order.status,
      ticket: {
        id: order.ticket._id,
      },
      version: order.__v,
    });

    res.json(order);
  }
);

export default router;
