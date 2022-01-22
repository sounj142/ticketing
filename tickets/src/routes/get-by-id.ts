import { NotFoundError, MongoHelper } from '@hoangrepo/common';
import express, { Request, Response } from 'express';
import { TicketModel } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets/:id', async (req: Request, res: Response) => {
  const id = MongoHelper.parseObjectIdAndThrowNotFound(req.params.id);

  const ticket = await TicketModel.findById(id);
  if (!ticket) {
    throw new NotFoundError('Ticket does not exist');
  }

  res.send(ticket);
});

export default router;
