import {
  Publisher,
  Subjects,
  TicketUpdatedEventDefinition,
} from '@hoangrepo/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEventDefinition> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
