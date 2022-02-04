import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/api/payments', async (_req: Request, res: Response) => {
  // const tickets = await TicketModel.find({});

  // res.send(tickets);

  res.send({});
});

export default router;
