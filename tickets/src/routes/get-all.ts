import { callMongoDb } from '@hoangorg/common';
import express, { Request, Response } from 'express';
import Ticket from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (_req: Request, res: Response) => {
  const tickets = await callMongoDb(() =>
    Ticket.find({ orderId: undefined }).exec()
  );

  res.send(tickets);
});

export default router;
