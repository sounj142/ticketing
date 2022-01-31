import {
  Listener,
  Subjects,
  OrderCancelledEvent,
  OrderCancelledEventDefinition,
} from '@hoangrepo/common';
import { TicketModel } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEventDefinition> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(event: OrderCancelledEvent): Promise<boolean> {
    console.log('Order cancelled message: ', event);

    const ticket = await TicketModel.findById(event.ticket.id);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.orderId = undefined;
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
