import {
  Publisher,
  Subjects,
  TicketUpdatedEventDefinition,
} from '@hoangrepo/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEventDefinition> {
  constructor() {
    super(Subjects.TicketUpdated);
  }
}
