import express from 'express';
import 'express-async-errors';
import currentUserRouter from './routes/current-user';
import signInRouter from './routes/sign-in';
import signOutRouter from './routes/sign-out';
import signUpRouter from './routes/sign-up';
import {
  configCommonMiddlewareForExpress,
  configCatchAllAndHandleErrorMiddlewaresForExpress,
} from '@hoangrepo/common';

const app = express();
configCommonMiddlewareForExpress(app);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

configCatchAllAndHandleErrorMiddlewaresForExpress(app);

export default app;
