import express from 'express';
import 'express-async-errors';
import {
  configCatchAllAndHandleErrorMiddlewares,
  configCommonMiddlewares,
  getCurrentUser,
} from '@hoangorg/common';
import getAllRouter from './routes/get-all';
import getByIdRouter from './routes/get-by-id';
import createRouter from './routes/create-order';
import cancelRouter from './routes/cancel-order';

const app = express();
configCommonMiddlewares(app);

app.use(getCurrentUser);

app.use(getAllRouter);
app.use(getByIdRouter);
app.use(createRouter);
app.use(cancelRouter);

configCatchAllAndHandleErrorMiddlewares(app);

export default app;
