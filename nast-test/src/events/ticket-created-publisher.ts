import {
  Publisher,
  Subjects,
  TicketCreatedEventDefinition,
} from '@hoangorg/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventDefinition> {
  readonly subject = Subjects.TicketCreated;
}
