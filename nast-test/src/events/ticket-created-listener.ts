import {
  Listener,
  Subjects,
  TicketCreatedEvent,
  TicketCreatedEventDefinition,
} from '@hoangorg/common';

export class TicketCreatedListener extends Listener<TicketCreatedEventDefinition> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName: string = 'listener-group';

  async onMessage(event: TicketCreatedEvent): Promise<boolean> {
    console.debug('Message Data: ', event);
    return true;
  }
}
