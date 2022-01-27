import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  DatabaseConnectionError,
  validateRequest,
  authentication,
  NotFoundError,
  BadRequestError,
  OrderStatus,
} from '@hoangrepo/common';
import { natsInfo } from '../nats-info';
import {
  getExpiresAt,
  OrderAttrs,
  OrderModel
} from '../models/order';
import { TicketModel } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

router.post(
  '/api/orders',
  authentication,
  [body('ticketId').not().isEmpty().withMessage('TicketId is required')],
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
          status: OrderStatus.AwaitingPayment,
          ticketId: ticketId,
        },
        {
          status: OrderStatus.Complete,
          ticketId: ticketId,
        },
      ],
    });
    if (currentOrder) {
      throw new BadRequestError(
        currentOrder.status === OrderStatus.AwaitingPayment
          ? 'Ticket has been locked by other order!'
          : 'Ticket has been sold'
      );
    }

    const order = new OrderModel<OrderAttrs>({
      userId: currentUser.id,
      status: OrderStatus.Created,
      expiresAt: getExpiresAt(),
      ticket: ticket,
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
      ticketId: order.ticket._id,
      version: order.__v,
    });

    res.status(201).send(order);
  }
);

export default router;
