import { OrderStatus } from '@hoangorg/common';
import Order from '../../../models/order';
import { createNewOrder } from '../../../test/helper';
import { natsInfo } from '../../../utils/nats-client';
import { ExpirationCompleteListener } from '../expiration-complete-listener';

it('thow exception if order id not found', async () => {
  try {
    await new ExpirationCompleteListener(natsInfo.client).onMessage({
      orderId: '61ea90014a0a5e110631163b',
    });
  } catch (error) {
    expect(error).toBeDefined();
    return;
  }
  throw new Error('Test failed');
});

it('if order status is Created, returns true, update order status to cancelled, and publish cancelled event', async () => {
  const { order } = await createNewOrder();
  jest.clearAllMocks();

  const result = await new ExpirationCompleteListener(
    natsInfo.client
  ).onMessage({
    orderId: order.id,
  });

  expect(result).toEqual(true);

  const orderToConfirm = await Order.findById(order.id);
  expect(orderToConfirm?.status).toEqual(OrderStatus.Cancelled);
  const eventData = JSON.parse(
    (natsInfo.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(eventData.id).toEqual(order.id);

  // ensure it publishes an event
  expect(natsInfo.client.publish).toHaveBeenCalledTimes(1);
});

it('if order status is Complete, returns true, not update order status, and publish nothing', async () => {
  const { order } = await createNewOrder();
  const orderToTest = await Order.findById(order.id);
  orderToTest!.status = OrderStatus.Complete;
  await orderToTest!.save();
  jest.clearAllMocks();

  const result = await new ExpirationCompleteListener(
    natsInfo.client
  ).onMessage({
    orderId: order.id,
  });

  expect(result).toEqual(true);

  const orderToConfirm = await Order.findById(order.id);
  expect(orderToConfirm?.status).toEqual(orderToTest?.status);

  // ensure it doesn't publish any event
  expect(natsInfo.client.publish).toHaveBeenCalledTimes(0);
});
