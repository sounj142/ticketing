import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  DatabaseConnectionError,
  validateRequest,
  authentication,
} from '@hoangrepo/common';
import { TicketModel, TicketAttrs } from '../models/ticket';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

const router = express.Router();
const ticketCreatedPublisher = new TicketCreatedPublisher();

export const ticketValidationRules = [
  body('title')
    .trim()
    .not()
    .isEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 2000 })
    .withMessage('Title must has at least 5 characters'),
  body('price')
    .isFloat({ gt: 0 })
    .withMessage('Price must be a positive number'),
];

router.post(
  '/api/tickets',
  authentication,
  ticketValidationRules,
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price }: { title: string; price: number } = req.body;

    const ticketDoc = new TicketModel<TicketAttrs>({
      title,
      price,
      userId: req.currentUser!.id,
    });
    try {
      await ticketDoc.save();
    } catch (err) {
      console.error(err);
      throw new DatabaseConnectionError();
    }

    await ticketCreatedPublisher.publish({
      id: ticketDoc.id,
      title: ticketDoc.title,
      price: ticketDoc.price,
      userId: ticketDoc.userId,
    });

    res.status(201).send(ticketDoc);
  }
);

export default router;
