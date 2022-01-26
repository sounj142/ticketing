import express from 'express';
import 'express-async-errors';
import getAllRouter from './routes/get-all';
import getByIdRouter from './routes/get-by-id';
import createRouter from './routes/create-order';
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
app.use(createRouter);

configCatchAllAndHandleErrorMiddlewaresForExpress(app);

export default app;
