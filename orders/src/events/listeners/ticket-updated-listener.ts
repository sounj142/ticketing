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
    console.log('Message: ', event);

    const ticket = await TicketModel.findById(event.id);
    if (!ticket) return false;
    
    // here
    // if (ticket.version + 1 !== event.version) return false;

    ticket.title = event.title;
    ticket.price = event.price;
    ticket.userId = event.userId;
    ticket.version = event.version;

    await ticket.save();

    return true;
  }
}
