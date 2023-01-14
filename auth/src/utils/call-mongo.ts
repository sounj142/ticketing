import { DatabaseConnectionError } from '../errors/database-connection-error';

const callMongoDb = async (
  action: () => Promise<any>,
  processError?: (err: any) => void,
  errorId?: string
) => {
  try {
    await action();
  } catch (err: any) {
    if (processError) processError(err);

    console.error(err);
    throw new DatabaseConnectionError(errorId);
  }
};

export default callMongoDb;
