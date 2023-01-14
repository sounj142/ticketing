import express from 'express';
import 'express-async-errors';
import { configCatchAllAndHandleErrorMiddlewares } from './config';
import currentUserRouter from './routes/current-user';
import signInRouter from './routes/sign-in';
import signOutRouter from './routes/sign-out';
import signUpRouter from './routes/sign-up';

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

configCatchAllAndHandleErrorMiddlewares(app);

const port = 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
