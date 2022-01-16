import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import currentUserRouter from './routes/current-user';
import signInRouter from './routes/sign-in';
import signOutRouter from './routes/sign-out';
import signUpRouter from './routes/sign-up';
import errorHandler from './middlewares/error-handler';
import NotFoundError from './errors/not-found-error';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';
import validateRequest from './middlewares/validate-request';

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
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

async function applicationStart() {
  checkApplicationVariables();
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to mongodb');

    const port = 3000;
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

applicationStart();

function checkApplicationVariables() {
  if (!process.env.JWT_PRIVATE_KEY) {
    throw new Error('Missing JWT_PRIVATE_KEY');
  }
  if (!process.env.JWT_PUBLIC_KEY) {
    throw new Error('Missing JWT_PUBLIC_KEY');
  }
}
