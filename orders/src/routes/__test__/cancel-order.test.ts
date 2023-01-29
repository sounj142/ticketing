import { JwtHelper, OrderStatus } from '@hoangorg/common';
import request from 'supertest';
import app from '../../app';
import Order from '../../models/order';
import { createNewOrder } from '../../test/helper';
import { natsInfo } from '../../utils/nats-client';

it('returns 401 if anonymous tries to cancel order', async () => {
  await request(app)
    .delete('/api/orders/61f12948e67a2571aacee969')
    .send()
    .expect(401);
});

it('returns a 404 when order does not exist', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .delete('/api/orders/4235445345')
    .set('Cookie', cookie)
    .send()
    .expect(404);

  await request(app)
    .delete('/api/orders/61ea90014a0a5e110631163b')
    .set('Cookie', cookie)
    .send()
    .expect(404);
});

it('return 403 if user try to cancel order belong to other user', async () => {
  const createResponse = await createNewOrder();
  const createdOrder = createResponse.order;

  const otherUserCookie = JwtHelper.generateCookieForTest({
    id: '61f12948e67a2571aacee969',
    email: 'aaaa@aaaa.com',
  });

  await request(app)
    .delete(`/api/orders/${createdOrder.id}`)
    .set('Cookie', otherUserCookie)
    .send()
    .expect(403);

  const order = await Order.findById(createdOrder.id).populate('ticket');
  expect(order!.userId).toEqual(createdOrder.userId);
  expect(order!.ticket.id).toEqual(createdOrder.ticket.id);
});

it('cancel an order with valid inputs', async () => {
  const { order, cookie } = await createNewOrder();
  jest.clearAllMocks();

  const res = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.userId).toEqual(order.userId);
  expect(res.body.id).toEqual(order.id);

  // ensure it publishes an event
  expect(natsInfo.client.publish).toHaveBeenCalledTimes(1);

  // ensure order was saved to db
  const orders = await Order.find({}).populate('ticket');
  expect(orders.length).toEqual(1);
  expect(orders[0].userId).toEqual(order.userId);
  expect(orders[0].id).toEqual(order.id);
  expect(orders[0].ticket.id).toEqual(order.ticket.id);
  expect(orders[0].status).toEqual(OrderStatus.Cancelled);
});

it('return 400 if user try to cancel a cancelled order', async () => {
  const { order, cookie } = await createNewOrder();

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(400);
});
