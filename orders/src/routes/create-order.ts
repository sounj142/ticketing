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
import { getExpiresDate, OrderAttrs, OrderModel } from '../models/order';
import { isReservedTicket, TicketModel } from '../models/ticket';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

router.post(
  '/api/orders',
  authentication,
  [body('ticketId').not().isEmpty().withMessage('TicketId is required')],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId: string = req.body.ticketId;
    const currentUser = req.currentUser!;

    // find the ticket the user is trying to order in the database
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError('Ticket does not exist');
    }

    // make sure that this ticket is not already reserved
    if (await isReservedTicket(ticketId)) {
      throw new BadRequestError('Ticket has been already reserved');
    }

    // build the order and save it to the database
    const order = new OrderModel<OrderAttrs>({
      userId: currentUser.id,
      status: OrderStatus.Created,
      ticket: ticket,
      ticketId: ticket._id,
      expiresAt: getExpiresDate(),
    });
    try {
      await order.save();
    } catch (err) {
      console.error(err);
      throw new DatabaseConnectionError();
    }

    // publish an event saying that an order was created
    await new OrderCreatedPublisher(natsInfo.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: order.ticket._id,
        price: order.ticket.price,
        title: order.ticket.title,
      },
      version: order.__v,
    });

    res.status(201).send(order);
  }
);

export default router;
