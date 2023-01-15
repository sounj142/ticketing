import express from 'express';
import 'express-async-errors';
import {
  configCatchAllAndHandleErrorMiddlewares,
  configCommonMiddlewares,
} from './middlewares/shared';
import currentUserRouter from './routes/current-user';
import signInRouter from './routes/sign-in';
import signOutRouter from './routes/sign-out';
import signUpRouter from './routes/sign-up';

const app = express();
configCommonMiddlewares(app);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

configCatchAllAndHandleErrorMiddlewares(app);

export default app;
