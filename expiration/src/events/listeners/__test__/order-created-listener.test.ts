import { OrderCreatedEvent, OrderStatus } from '@hoangrepo/common';
import { natsInfo } from '../../../nats-info';
import { expirationQueue } from '../../../queues/expiration-queue';
import { OrderCreatedListener } from '../order-created-listener';

it('in happy case, call add method on expirationQueue', async () => {
  const event: OrderCreatedEvent = {
    id: '61f12948e67a2571aacee969',
    status: OrderStatus.Created,
    userId: '61ea90014a0a5e110631163b',
    expiresAt: new Date().toISOString(),
    ticket: {
      id: '61ea90014a0a5e110631163b',
      price: 10,
      title: 'ticket test',
    },
    version: 0,
  };

  const result = await new OrderCreatedListener(natsInfo.client).onMessage(
    event
  );

  expect(result).toEqual(true);

  // ensure it call add method on expirationQueue
  expect(expirationQueue.add).toHaveBeenCalledTimes(1);
  const params = (expirationQueue.add as jest.Mock).mock.calls[0];
  
  const queueData = params[0];
  expect(event.id).toEqual(queueData.orderId);
});
