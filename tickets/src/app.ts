import express from 'express';
import 'express-async-errors';
import {
  configCatchAllAndHandleErrorMiddlewares,
  configCommonMiddlewares,
  getCurrentUser,
} from '@hoangorg/common';
import getAllTicketsRouter from './routes/get-all';
import getTicketByIdRouter from './routes/get-by-id';
import createTicketRouter from './routes/create-ticket';
import updateTicketRouter from './routes/update-ticket';

const app = express();
configCommonMiddlewares(app);

app.use(getCurrentUser);

app.use(getAllTicketsRouter);
app.use(getTicketByIdRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);

configCatchAllAndHandleErrorMiddlewares(app);

export default app;
