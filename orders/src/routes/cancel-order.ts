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
import { OrderUpdatedPublisher } from '../events/publishers/order-updated-publisher';
import { natsInfo } from '../nats-info';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  authentication,
  async (req: Request, res: Response) => {
    const id = MongoHelper.parseObjectIdAndThrowNotFound(req.params.id);

    const order = await OrderModel.findById(id).populate('ticket');;
    if (!order) {
      throw new NotFoundError('Order does not exist');
    }
    if (order.userId !== req.currentUser!.id) {
      throw new ForbiddenError();
    }
    if (
      order.status === OrderStatus.Cancelled ||
      order.status === OrderStatus.Complete
    ) {
      throw new BadRequestError("Can't cancel this order");
    }

    order.status = OrderStatus.Cancelled;
    try {
      await order.save();
    } catch (err) {
      console.error(err);
      throw new DatabaseConnectionError();
    }

    await new OrderUpdatedPublisher(natsInfo.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt,
      ticketId: order.ticket._id,
      version: order.__v,
    });

    res.send(order);
  }
);

export default router;
