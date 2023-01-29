import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import {
  validateRequest,
  authentication,
  NotFoundError,
  BadRequestError,
  OrderStatus,
  callMongoDb,
} from '@hoangorg/common';
import Order, { getExpiresDate, isReservedTicket } from '../models/order';
import Ticket from '../models/ticket';
import { getOrderCreatedPublisher } from '../events/publishers/order-created-publisher';

const router = express.Router();

const validationRules = [
  body('ticketId')
    .not()
    .isEmpty()
    .withMessage('Ticket Id is required.')
    .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
    .withMessage('Ticket Id should be a valid ObjectId.'),
];

router.post(
  '/api/orders',
  authentication,
  validationRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const ticketId: string = req.body.ticketId;
    const currentUser = req.currentUser!;

    // find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError('Ticket does not exist.');

    // make sure that this ticket is not already reserved
    if (await isReservedTicket(ticketId)) {
      throw new BadRequestError('Ticket has been already reserved.');
    }

    // build the order and save it to the database
    const order = Order.build({
      userId: currentUser.id,
      status: OrderStatus.Created,
      expiresAt: getExpiresDate(),
      ticketId: ticket._id,
      ticket: ticket,
    });

    await callMongoDb(() => order.save());

    // publish an event saying that an order was created
    await getOrderCreatedPublisher().publish({
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
