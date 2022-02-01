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
    let delayTime = new Date(event.expiresAt).valueOf() - new Date().valueOf();
    if (delayTime < 0) delayTime = 0;

    await expirationQueue.add({ orderId: event.id }, { delay: delayTime });
    console.log(
      `Add order id ${event.id} to bull queue, delay time: ${delayTime / 1000}s`
    );

    return true;
  }
}
