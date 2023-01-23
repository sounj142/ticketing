import { natsWrapper } from '@hoangorg/common';

export function configGracefulShutdown() {
  natsWrapper.client.on('close', () => {
    console.log('NATS connection closed.');
    console.log('Closing app...');
    process.exit();
  });

  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());
}
