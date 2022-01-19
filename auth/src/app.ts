import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import currentUserRouter from './routes/current-user';
import signInRouter from './routes/sign-in';
import signOutRouter from './routes/sign-out';
import signUpRouter from './routes/sign-up';
import { errorHandler, NotFoundError } from '@hoangrepo/common';
import cookieSession from 'cookie-session';
import { isTestEnvironment } from './env';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: !isTestEnvironment,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all('*', () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
