import express from 'express';
import 'express-async-errors';
import currentUserRouter from './routes/current-user';
import signInRouter from './routes/sign-in';
import signOutRouter from './routes/sign-out';
import signUpRouter from './routes/sign-up';
import refreshTokenRouter from './routes/refresh-token';
import {
  configCatchAllAndHandleErrorMiddlewares,
  configCommonMiddlewares,
} from '@hoangorg/common';

const app = express();
configCommonMiddlewares(app);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);
app.use(refreshTokenRouter);

configCatchAllAndHandleErrorMiddlewares(app);

export default app;
