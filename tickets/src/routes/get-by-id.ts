import {
  NotFoundError,
  parseObjectIdAndThrowNotFound,
  callMongoDb,
} from '@hoangorg/common';
import express, { Request, Response } from 'express';
import Ticket from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const id = parseObjectIdAndThrowNotFound(
    req.params.id,
    'Ticket does not exist.'
  );

  const ticket = await callMongoDb(() => Ticket.findById(id).exec());
  if (!ticket) {
    throw new NotFoundError('Ticket does not exist.');
  }

  res.json(ticket);
});

export default router;
