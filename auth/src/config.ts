// import cookieSession from 'cookie-session';
import { Express, json } from 'express';
// import { isTestEnvironment } from './env';
import { NotFoundError } from './errors/not-found-error';
import { errorHandler } from './middlewares/error-handler';

export const isDevelopmentEnv =
  !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// export function configCommonMiddlewares(app: Express) {
//   app.set('trust proxy', true);
//   app.use(json());
//   app.use(
//     cookieSession({
//       signed: false,
//       secure: !isTestEnvironment,
//     })
//   );
//   return app;
// }

export function configCatchAllAndHandleErrorMiddlewares(
  app: Express
) {
  app.all('*', () => {
    throw new NotFoundError();
  });

  app.use(errorHandler);
  return app;
}
