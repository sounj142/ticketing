import Queue from 'bull';

interface ExpirationInfo {
  orderId: string;
}

const expirationQueue = new Queue<ExpirationInfo>('order:expiration', {
  redis: {
    host: process.env!.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  console.log(
    'I want to publish a expiration:complete event for order id ',
    job.data.orderId
  );
});

export { expirationQueue };
