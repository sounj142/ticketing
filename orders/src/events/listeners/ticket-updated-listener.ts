import {
  Listener,
  Subjects,
  TicketUpdatedEvent,
  TicketUpdatedEventDefinition,
} from '@hoangorg/common';
import { findByEvent } from '../../models/ticket';
import { queueGroupName } from './queue-group-name';

export class TicketUpdatedListener extends Listener<TicketUpdatedEventDefinition> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName: string = queueGroupName;

  async onMessage(event: TicketUpdatedEvent): Promise<boolean> {
    const ticket = await findByEvent(event);
    if (!ticket) return false;

    ticket.title = event.title;
    ticket.price = event.price;
    ticket.userId = event.userId;
    // notice: because Tickets collection doesn't belong to Orders service, We only increment version here!
    ticket.increment();

    await ticket.save();

    return true;
  }
}
