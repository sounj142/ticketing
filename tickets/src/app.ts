import express from 'express';
import 'express-async-errors';
import getAllRouter from './routes/gets-all';
import getByIdRouter from './routes/get-by-id';
import {
  configCommonMiddlewareForExpress,
  configCatchAllAndHandleErrorMiddlewaresForExpress,
} from '@hoangrepo/common';

const app = express();
configCommonMiddlewareForExpress(app);

app.use(getAllRouter);
app.use(getByIdRouter);

configCatchAllAndHandleErrorMiddlewaresForExpress(app);

export default app;
