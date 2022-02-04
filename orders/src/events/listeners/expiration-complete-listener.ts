import {
  Listener,
  Subjects,
  ExpirationCompleteEvent,
  ExpirationCompleteEventDefinition,
  OrderStatus,
} from '@hoangrepo/common';
import { OrderModel } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { queueGroupName } from './queue-group-name';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEventDefinition> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName: string = queueGroupName;

  async onMessage(event: ExpirationCompleteEvent): Promise<boolean> {
    const order = await OrderModel.findById(event.orderId).populate('ticket');
    if (!order) {
      throw new Error('Order not found');
    }

    if (
      order.status === OrderStatus.Created ||
      order.status === OrderStatus.AwaitingPayment
    ) {
      order.status = OrderStatus.Cancelled;
      await order.save();

      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        status: order.status,
        ticket: {
          id: order.ticket._id,
        },
        version: order.__v,
      });
    }

    return true;
  }
}
