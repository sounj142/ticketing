import {
  Publisher,
  Subjects,
  TicketCreatedEventDefinition,
} from '@hoangrepo/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventDefinition> {
  constructor() {
    super(Subjects.TicketCreated);
  }
}
