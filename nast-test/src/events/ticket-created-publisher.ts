import { Stan } from 'node-nats-streaming';
import {
  Publisher,
  Subjects,
  TicketCreatedEventDefinition,
} from '@hoangorg/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventDefinition> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  constructor(client: Stan) {
    super(client);
  }
}
