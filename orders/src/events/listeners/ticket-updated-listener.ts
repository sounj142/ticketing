import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
  TicketUpdatedEventDefinition,
} from '@hoangrepo/common';
import { TicketModel } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEventDefinition> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(event: TicketUpdatedEvent): Promise<boolean> {
    console.log('Ticket updated message: ', event);

    const ticket = await TicketModel.findById(event.id);
    if (!ticket) return false;

    if (ticket.__v + 1 !== event.version) return false;

    ticket.title = event.title;
    ticket.price = event.price;
    ticket.userId = event.userId;

    await ticket.save();

    return true;
  }
}
