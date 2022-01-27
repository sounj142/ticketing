import { Stan } from 'node-nats-streaming';
import {
  Publisher,
  Subjects,
  OrderUpdatedEventDefinition,
} from '@hoangrepo/common';

export class OrderUpdatedPublisher extends Publisher<OrderUpdatedEventDefinition> {
  constructor(client: Stan) {
    super(client, Subjects.OrderUpdated);
  }
}
