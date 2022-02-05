import {
  Listener,
  Subjects,
  PaymentCreatedEvent,
  PaymentCreatedEventDefinition,
  OrderStatus,
} from '@hoangrepo/common';
import { OrderModel } from '../../models/order';
import { queueGroupName } from './queue-group-name';

export class PaymentCreatedListener extends Listener<PaymentCreatedEventDefinition> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(event: PaymentCreatedEvent): Promise<boolean> {
    const order = await OrderModel.findById(event.orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      throw new Error('Try to pay an already completed order');
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new Error('Try to pay a cancelled order');
    }

    order.status = OrderStatus.Complete;
    await order.save();

    return true;
  }
}
