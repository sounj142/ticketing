import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-publisher';
import { natsInfo } from '../nats-info';

interface ExpirationInfo {
  orderId: string;
}

const expirationQueue = new Queue<ExpirationInfo>('order:expiration', {
  redis: {
    host: process.env!.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  await new ExpirationCompletePublisher(natsInfo.client).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
