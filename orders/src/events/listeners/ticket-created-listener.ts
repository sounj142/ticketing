import {
  Listener,
  Subjects,
  TicketCreatedEvent,
  TicketCreatedEventDefinition,
} from '@hoangrepo/common';
import { Ticket, TicketModel } from '../../models/ticket';

export class TicketCreatedListener extends Listener<TicketCreatedEventDefinition> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = 'orders-listener';

  async onMessage(event: TicketCreatedEvent): Promise<boolean> {
    console.log('Receive Message Data: ', event);

    const ticketModel = new TicketModel<Ticket>({
      title: event.title,
      price: event.price,
      userId: event.userId,
      version: event.version,
      _id: event.id,
    });

    await ticketModel.save();

    return true;
  }
}
