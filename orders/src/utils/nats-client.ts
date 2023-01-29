import { natsWrapper } from '@hoangorg/common';

export const natsInfo = natsWrapper;

export async function configNATS() {
  await natsInfo.connect(
    process.env.NATS_CLUSTER_ID!,
    process.env.NATS_CLIENT_ID!,
    process.env.NATS_URI!
  );

  // new OrderCreatedListener(natsInfo.client).listen();
  // new OrderCancelledListener(natsInfo.client).listen();
}
