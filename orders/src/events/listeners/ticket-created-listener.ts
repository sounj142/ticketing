import {
  Listener,
  Subjects,
  TicketCreatedEvent,
  TicketCreatedEventDefinition,
} from '@hoangorg/common';
import Ticket from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketCreatedListener extends Listener<TicketCreatedEventDefinition> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(event: TicketCreatedEvent): Promise<boolean> {
    const ticketModel = Ticket.build({
      _id: event.id,
      title: event.title,
      price: event.price,
      userId: event.userId,
    });

    await ticketModel.save();

    return true;
  }
}
