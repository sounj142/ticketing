import { OrderCancelledEvent, OrderStatus, Subjects } from '@hoangrepo/common';
import { Order, OrderModel } from '../../../models/order';
import { natsInfo } from '../../../nats-info';
import { OrderCancelledListener } from '../order-cancelled-listener';

async function setUp() {
  const order = new OrderModel<Order>({
    _id: '61f12948e67a2571aacee969',
    userId: '61ea90014a0a5e110631177a',
    price: 10,
    status: OrderStatus.Created,
  });

  await order.save();

  const event: OrderCancelledEvent = {
    id: order.id,
    status: OrderStatus.Cancelled,
    ticket: {
      id: '61ea90014a0a5e110631163b',
    },
    version: 1,
  };
  return { order, event };
}

it('in happy case, returns true and save order status to db', async () => {
  const { event } = await setUp();

  const result = await new OrderCancelledListener(natsInfo.client).onMessage(
    event
  );

  expect(result).toEqual(true);

  const confirmOrder = await OrderModel.findById(event.id);

  expect(confirmOrder?.status).toEqual(event.status);
  expect(confirmOrder?.__v).toEqual(event.version);
});

it('if order does not exist, return false', async () => {
  const { event } = await setUp();

  event.id = '61f12948e67a2571aacee666';

  const result = await new OrderCancelledListener(natsInfo.client).onMessage(
    event
  );

  expect(result).toEqual(false);
});

it('if order version does not correct, return false', async () => {
  const { event } = await setUp();

  event.version = 2;

  const result = await new OrderCancelledListener(natsInfo.client).onMessage(
    event
  );

  expect(result).toEqual(false);
});
