import {
  Listener,
  Subjects,
  OrderCreatedEvent,
  OrderCreatedEventDefinition,
} from '@hoangrepo/common';
import { TicketModel } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEventDefinition> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(event: OrderCreatedEvent): Promise<boolean> {
    const ticket = await TicketModel.findById(event.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.orderId = event.id;
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.__v,
      orderId: ticket.orderId,
    });

    return true;
  }
}
