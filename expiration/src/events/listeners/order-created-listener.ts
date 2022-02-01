import {
  Listener,
  Subjects,
  OrderCreatedEvent,
  OrderCreatedEventDefinition,
} from '@hoangrepo/common';
import { expirationQueue } from '../../queues/expiration-queue';
import { queueGroupName } from './queue-group-name';

export class OrderCreatedListener extends Listener<OrderCreatedEventDefinition> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName: string = queueGroupName;

  async onMessage(event: OrderCreatedEvent): Promise<boolean> {
    await expirationQueue.add({ orderId: event.id }, { delay: 10000 });
    console.log(`Add order id ${event.id} to bull queue`);

    return true;
  }
}
