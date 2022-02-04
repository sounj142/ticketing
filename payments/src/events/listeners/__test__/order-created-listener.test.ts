import { OrderCreatedEvent, OrderStatus, Subjects } from '@hoangrepo/common';
import { Order, OrderModel } from '../../../models/order';
import { natsInfo } from '../../../nats-info';
import { OrderCreatedListener } from '../order-created-listener';

it('in happy case, returns true and save order to db', async () => {
  const event: OrderCreatedEvent = {
    id: '61f12948e67a2571aacee969',
    status: OrderStatus.Created,
    userId: '61ea90014a0a5e110631163b',
    expiresAt: new Date().toISOString(),
    ticket: {
      id: '61f12948e67a2571aacee777',
      price: 100,
      title: 'test ticket',
    },
    version: 0,
  };

  const result = await new OrderCreatedListener(natsInfo.client).onMessage(
    event
  );

  expect(result).toEqual(true);

  const confirmOrder = await OrderModel.findById(event.id);
  expect(confirmOrder?.price).toEqual(event.ticket.price);
  expect(confirmOrder?.status).toEqual(event.status);
});
