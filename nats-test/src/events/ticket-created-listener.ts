import {
  Listener,
  Subjects,
  TicketCreatedEvent,
  TicketCreatedEventDefinition,
} from '@hoangrepo/common';

export class TicketCreatedListener extends Listener<TicketCreatedEventDefinition> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = 'listener-group';

  async onMessage(event: TicketCreatedEvent): Promise<boolean> {
    console.log('Message Data: ', event);
    return true;
  }
}
