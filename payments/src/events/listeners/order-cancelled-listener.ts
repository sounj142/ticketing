import {
  Listener,
  Subjects,
  OrderCancelledEvent,
  OrderCancelledEventDefinition,
} from '@hoangrepo/common';
import { findByEvent } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEventDefinition> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName: string = queueGroupName;

  async onMessage(event: OrderCancelledEvent): Promise<boolean> {
    const order = await findByEvent(event);
    if (!order) return false;

    order.status = event.status;
    // notice: because Orders collection doesn't belong to Payments service, We only increment version here!
    order.increment();

    await order.save();

    return true;
  }
}
