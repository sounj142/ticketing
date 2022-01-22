import express, { Request, Response } from 'express';
import { TicketModel } from '../models/ticket';

const router = express.Router();

router.get('/api/tickets', async (_req: Request, res: Response) => {
  const tickets = await TicketModel.find({});

  res.send(tickets);
});

export default router;
