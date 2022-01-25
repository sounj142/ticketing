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

const router = express.Router();
const ticketUpdatedPublisher = new TicketUpdatedPublisher();

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
    try {
      await ticket.save();
    } catch (err) {
      console.error(err);
      throw new DatabaseConnectionError();
    }

    await ticketUpdatedPublisher.publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.send(ticket);
  }
);

export default router;
