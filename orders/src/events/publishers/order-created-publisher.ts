import { Stan } from 'node-nats-streaming';
import {
  Publisher,
  Subjects,
  OrderCreatedEventDefinition,
} from '@hoangrepo/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEventDefinition> {
  constructor(client: Stan) {
    super(client, Subjects.OrderCreated);
  }
}
