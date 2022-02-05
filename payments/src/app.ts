import express from 'express';
import 'express-async-errors';
import createPaymentRouter from './routes/create-payment';
import {
  configCommonMiddlewareForExpress,
  configCatchAllAndHandleErrorMiddlewaresForExpress,
  getCurrentUser,
} from '@hoangrepo/common';

const app = express();
configCommonMiddlewareForExpress(app);
app.use(getCurrentUser);

app.use(createPaymentRouter);

configCatchAllAndHandleErrorMiddlewaresForExpress(app);

export default app;
