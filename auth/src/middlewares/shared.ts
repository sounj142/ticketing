import cookieSession from 'cookie-session';
import { Express, json } from 'express';
import { NotFoundError } from '../errors/not-found-error';
import { isTestEnvironment } from '../utils/config';
import { errorHandler } from './error-handler';

export function configCommonMiddlewares(app: Express) {
  app.set('trust proxy', true);
  app.use(
    cookieSession({
      signed: false,
      secure: !isTestEnvironment,
    })
  );
  app.use(json());

  return app;
}

export function configCatchAllAndHandleErrorMiddlewares(app: Express) {
  app.all('*', () => {
    throw new NotFoundError();
  });
  app.use(errorHandler);
  return app;
}
