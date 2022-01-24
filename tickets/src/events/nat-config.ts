import { Stan } from 'node-nats-streaming';

interface NatsConfigInterface {
  natsClient?: Stan;
}

export const NatsConfig: NatsConfigInterface = {
  natsClient: undefined,
};
