import express from 'express';
import 'express-async-errors';
import getAllRouter from './routes/get-all';
import {
  configCommonMiddlewareForExpress,
  configCatchAllAndHandleErrorMiddlewaresForExpress,
  getCurrentUser,
} from '@hoangrepo/common';

const app = express();
configCommonMiddlewareForExpress(app);
app.use(getCurrentUser);

app.use(getAllRouter);

configCatchAllAndHandleErrorMiddlewaresForExpress(app);

export default app;
