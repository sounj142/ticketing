import express, { Request, Response } from 'express';
import {
  validateRequest,
  authentication,
  NotFoundError,
  ForbiddenError,
  parseObjectIdAndThrowNotFound,
  callMongoDb,
} from '@hoangorg/common';
import Ticket from '../models/ticket';
import { ticketValidationRules } from './create-ticket';
// import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
// import { natsInfo } from '../nats-info';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  authentication,
  ticketValidationRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const id = parseObjectIdAndThrowNotFound(
      req.params.id,
      'Ticket does not exist.'
    );

    const ticket = await callMongoDb(() => Ticket.findById(id).exec());
    if (!ticket) {
      throw new NotFoundError('Ticket does not exist.');
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new ForbiddenError();
    }
    // if (ticket.orderId) {
    //   throw new BadRequestError('Cannot edit a reserved ticket');
    // }

    const { title, price }: { title: string; price: number } = req.body;
    ticket.title = title;
    ticket.price = price;

    if (ticket.isModified()) {
      await callMongoDb(() => ticket.save());

      // await new TicketUpdatedPublisher(natsInfo.client).publish({
      //   id: ticket.id,
      //   title: ticket.title,
      //   price: ticket.price,
      //   userId: ticket.userId,
      //   version: ticket.__v,
      //   //version: ticket.__v == 1 ? 2 : ticket.__v == 2 ? 1 : ticket.__v,
      //   orderId: ticket.orderId,
      // });
    }

    res.send(ticket);
  }
);

export default router;
