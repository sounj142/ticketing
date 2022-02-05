import { natsInfo } from './nats-info';
import mongoose from 'mongoose';
import app from './app';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

async function configNATS() {
  await natsInfo.connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URI!
  );
  console.log('Connected to NAST');
  new OrderCreatedListener(natsInfo.client).listen();
  new OrderCancelledListener(natsInfo.client).listen();

  natsInfo.configGracefulShutdown(() => {
    process.exit();
  });
}

async function applicationStart() {
  checkApplicationVariables();
  try {
    await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected to mongodb');

    await configNATS();

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
  if (!process.env.ACK_WAIT_IN_MILISECONDS) {
    throw new Error('Missing ACK_WAIT_IN_MILISECONDS');
  }
  if (!process.env.STRIPE_KEY) {
    throw new Error('Missing STRIPE_KEY');
  }
}
