import { natsInfo } from './nats-info';
import mongoose from 'mongoose';
import app from './app';

async function applicationStart() {
  checkApplicationVariables();
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to mongodb');

    await natsInfo.connect(
      process.env.NATS_CLUSTER_ID!,
      process.env.NATS_CLIENT_ID!,
      process.env.NATS_URI!
    );
    console.log('Connected to NAST');
    natsInfo.configGracefulShutdown(() => {
      process.exit();
    });

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
  if (!process.env.JWT_PUBLIC_KEY) {
    throw new Error('Missing JWT_PUBLIC_KEY');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI');
  }
  if (!process.env.NATS_URI) {
    throw new Error('Missing NATS_URI');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Missing NATS_CLUSTER_ID');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Missing NATS_CLIENT_ID');
  }
}
