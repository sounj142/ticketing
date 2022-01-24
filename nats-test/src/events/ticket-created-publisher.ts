import {
  Publisher,
  Subjects,
  TicketCreatedEventDefinition,
} from '@hoangrepo/common';
import { Stan } from 'node-nats-streaming';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventDefinition> {
  constructor(client: Stan) {
    super(client, Subjects.TicketCreated);
  }
}
