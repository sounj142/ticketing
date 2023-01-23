import app from './app';
import mongoose from 'mongoose';
import { checkEnvironmentVariables } from '@hoangorg/common';
import { configNATS } from './utils/nats-client';
import { configGracefulShutdown } from './utils/graceful-shutdown';

checkEnvironmentVariables(
  'MONGO_URI',
  'JWT_PUBLIC_KEY',
  'NATS_CLUSTER_ID',
  'NATS_CLIENT_ID',
  'NATS_URI'
);

(async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to mongodb...');

    await configNATS();

    const port = 3000;
    app.listen(port, () => {
      console.log(`Listening on port ${port}...`);
    });

    configGracefulShutdown();
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
})();
