import express from 'express';
import 'express-async-errors';
import createOrder from './routes/create-order';
import {
  configCommonMiddlewareForExpress,
  configCatchAllAndHandleErrorMiddlewaresForExpress,
  getCurrentUser,
} from '@hoangrepo/common';

const app = express();
configCommonMiddlewareForExpress(app);
app.use(getCurrentUser);

app.use(createOrder);

configCatchAllAndHandleErrorMiddlewaresForExpress(app);

export default app;
