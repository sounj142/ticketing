import express, { Request, Response } from 'express';
import {
  DatabaseConnectionError,
  validateRequest,
  authentication,
  MongoHelper,
  NotFoundError,
  ForbiddenError,
} from '@hoangrepo/common';
import { TicketModel } from '../models/ticket';
import { ticketValidationRules } from './create-ticket';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsInfo } from '../nats-info';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  authentication,
  ticketValidationRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const id = MongoHelper.parseObjectIdAndThrowNotFound(req.params.id);

    const ticket = await TicketModel.findById(id);
    if (!ticket) {
      throw new NotFoundError('Ticket does not exist');
    }
    if (ticket.userId !== req.currentUser!.id) {
      throw new ForbiddenError();
    }

    const { title, price }: { title: string; price: number } = req.body;
    ticket.title = title;
    ticket.price = price;

    if (ticket.isModified()) {
      try {
        await ticket.save();
      } catch (err) {
        console.error(err);
        throw new DatabaseConnectionError();
      }

      await new TicketUpdatedPublisher(natsInfo.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.__v,
      });
    }

    res.send(ticket);
  }
);

export default router;
