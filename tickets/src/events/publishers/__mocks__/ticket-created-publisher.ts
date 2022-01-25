import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
  TicketCreatedEventDefinition,
} from '@hoangrepo/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventDefinition> {
  constructor() {
    super(Subjects.TicketCreated);
  }

  override publish(_event: TicketCreatedEvent): Promise<void> {
    return new Promise<void>((resolve, _reject) => {
      resolve();
    });
  }
}
