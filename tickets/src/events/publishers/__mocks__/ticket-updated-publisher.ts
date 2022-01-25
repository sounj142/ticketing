import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
  TicketUpdatedEventDefinition,
} from '@hoangrepo/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEventDefinition> {
  constructor() {
    super(Subjects.TicketUpdated);
  }

  override publish(_event: TicketUpdatedEvent): Promise<void> {
    return new Promise<void>((resolve, _reject) => {
      resolve();
    });
  }
}
