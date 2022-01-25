import { Stan } from 'node-nats-streaming';
import {
  Publisher,
  Subjects,
  TicketUpdatedEventDefinition,
} from '@hoangrepo/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEventDefinition> {
  constructor(client: Stan) {
    super(client, Subjects.TicketUpdated);
  }
}
