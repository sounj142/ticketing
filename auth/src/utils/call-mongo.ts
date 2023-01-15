import { DatabaseConnectionError } from '../errors/database-connection-error';

const callMongoDb = async <T>(
  action: () => Promise<T>,
  processError?: (err: any) => void,
  errorId?: string
) => {
  try {
    return await action();
  } catch (err: any) {
    if (processError) processError(err);

    console.error(err);
    throw new DatabaseConnectionError(errorId);
  }
};

export default callMongoDb;
