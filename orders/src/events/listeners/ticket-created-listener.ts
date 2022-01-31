import {
  Listener,
  Subjects,
  TicketCreatedEvent,
  TicketCreatedEventDefinition,
} from '@hoangrepo/common';
import { Ticket, TicketModel } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEventDefinition> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(event: TicketCreatedEvent): Promise<boolean> {
    console.log('Ticket created message: ', event);

    const ticketModel = new TicketModel<Ticket>({
      _id: event.id,
      title: event.title,
      price: event.price,
      userId: event.userId,
    });

    await ticketModel.save();

    return true;
  }
}
