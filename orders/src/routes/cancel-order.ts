import express, { Request, Response } from 'express';
import {
  DatabaseConnectionError,
  authentication,
  MongoHelper,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
  OrderStatus,
} from '@hoangrepo/common';
import { OrderModel } from '../models/order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsInfo } from '../nats-info';

const router = express.Router();

router.delete(
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
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('This order has already been cacelled');
    }

    order.status = OrderStatus.Cancelled;
    try {
      await order.save();
    } catch (err) {
      console.error(err);
      throw new DatabaseConnectionError();
    }

    await new OrderCancelledPublisher(natsInfo.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt,
      ticket: {
        id: order.ticket._id,
        price: order.ticket.price,
        title: order.ticket.title,
      },
      version: order.__v,
    });

    res.send(order);
  }
);

export default router;
