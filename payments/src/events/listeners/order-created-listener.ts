import {
  Listener,
  Subjects,
  OrderCreatedEvent,
  OrderCreatedEventDefinition,
} from '@hoangrepo/common';
import { Order, OrderModel } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEventDefinition> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(event: OrderCreatedEvent): Promise<boolean> {
    const order = new OrderModel<Order>({
      _id: event.id,
      userId: event.userId,
      status: event.status,
      price: event.ticket.price,
    });
    await order.save();

    return true;
  }
}
