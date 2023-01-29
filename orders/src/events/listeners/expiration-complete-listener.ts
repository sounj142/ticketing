import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  ExpirationCompleteEventDefinition,
  OrderStatus,
} from '@hoangorg/common';
import Order from '../../models/order';
import { getOrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEventDefinition> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;

  async onMessage(event: ExpirationCompleteEvent): Promise<boolean> {
    const order = await Order.findById(event.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found');
    }

    if (
      order.status === OrderStatus.Complete ||
      order.status === OrderStatus.Cancelled
    ) {
      return true;
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    await getOrderCancelledPublisher().publish({
      id: order.id,
      status: order.status,
      ticket: {
        id: order.ticket._id,
      },
      version: order.__v,
    });

    return true;
  }
}
