import express from 'express';
import 'express-async-errors';
import getAllRouter from './routes/get-all';
import getByIdRouter from './routes/get-by-id';
import createTicket from './routes/create-ticket';
import updateTicket from './routes/update-ticket';
import {
  configCommonMiddlewareForExpress,
  configCatchAllAndHandleErrorMiddlewaresForExpress,
  getCurrentUser,
} from '@hoangrepo/common';

const app = express();
configCommonMiddlewareForExpress(app);
app.use(getCurrentUser);

app.use(getAllRouter);
app.use(getByIdRouter);
app.use(createTicket);
app.use(updateTicket);

configCatchAllAndHandleErrorMiddlewaresForExpress(app);

export default app;
