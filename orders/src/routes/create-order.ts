import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  DatabaseConnectionError,
  validateRequest,
  authentication,
  NotFoundError,
  BadRequestError,
} from '@hoangrepo/common';
import { natsInfo } from '../nats-info';
import {
  getExpiresAt,
  OrderAttrs,
  OrderModel,
  OrderStatus,
} from '../models/order';
import { TicketModel } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

router.post(
  '/api/orders',
  authentication,
  [body('ticketId').not().isEmpty().withMessage('Ticket Id is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId }: { ticketId: string } = req.body;
    const currentUser = req.currentUser!;

    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket does not exist');
    }

    const currentOrder = await OrderModel.findOne({
      $or: [
        {
          status: OrderStatus.Pending,
          ticketId: ticketId,
        },
        {
          status: OrderStatus.Paid,
          ticketId: ticketId,
        },
      ],
    });
    if (currentOrder) {
      throw new BadRequestError(
        currentOrder.status === OrderStatus.Pending
          ? 'Ticket has been locked by other order!'
          : 'Ticket has been ordered'
      );
    }

    const order = new OrderModel<OrderAttrs>({
      userId: currentUser.id,
      status: OrderStatus.Pending,
      expiresAt: getExpiresAt(),
      ticketId: ticket.id,
    });
    try {
      await order.save();
    } catch (err) {
      console.error(err);
      throw new DatabaseConnectionError();
    }

    await new OrderCreatedPublisher(natsInfo.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt,
      ticketId: order.ticketId,
      version: order.__v,
    });

    res.status(201).send(order);
  }
);

export default router;
