import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsInfo } from './nats-info';

async function configNATS() {
  await natsInfo.connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URI!
  );
  console.log('Connected to NAST.');
  new OrderCreatedListener(natsInfo.client).listen();

  natsInfo.configGracefulShutdown(() => {
    process.exit();
  });
}

async function applicationStart() {
  checkApplicationVariables();
  try {
    await configNATS();
  } catch (err) {
    console.error(err);
  }
}

applicationStart();

function checkApplicationVariables() {
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
}
