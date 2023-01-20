import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, authentication, callMongoDb } from '@hoangorg/common';
import Ticket from '../models/ticket';
// import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
// import { natsInfo } from '../nats-info';

const router = express.Router();

export const ticketValidationRules = [
  body('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Title is required.')
    .isLength({ min: 5, max: 2000 })
    .withMessage('Title must has at least 5 characters.'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number.'),
];

router.post(
  '/api/tickets',
  authentication,
  ticketValidationRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price }: { title: string; price: number } = req.body;

    const ticket = Ticket.build({
      title,
      price,
      userId: req.currentUser!.id,
    });

    await callMongoDb(() => ticket.save());

    // await new TicketCreatedPublisher(natsInfo.client).publish({
    //   id: ticket.id,
    //   title: ticket.title,
    //   price: ticket.price,
    //   userId: ticket.userId,
    //   version: ticket.__v,
    // });

    res.status(201).json(ticket);
  }
);

export default router;
