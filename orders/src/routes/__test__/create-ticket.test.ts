import { JwtHelper } from '@hoangrepo/common';
import request from 'supertest';
import app from '../../app';
import { OrderModel, OrderStatus } from '../../models/order';
import { natsInfo } from '../../nats-info';
import { createNewOrder, testUser } from '../../test/helper';

it('returns 401 if anonymous tries to create order', async () => {
  await request(app)
    .post('/api/orders')
    .send({
      ticketId: '61f12948e67a2571aacee969',
    })
    .expect(401);
});

it('returns a 400 on invalid ticketId', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: '',
    })
    .expect(400);

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send()
    .expect(400);
});

it('returns a 404 if ticket id not found', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: '61f12948e67a2571aacee969',
    })
    .expect(404);
});

it('create an order with valid inputs', async () => {
  const { ticket, order } = await createNewOrder();

  expect(order.userId).toEqual(testUser.id);
  expect(order.ticketId).toEqual(ticket.id);

  // ensure it publishes an event
  expect(natsInfo.client.publish).toHaveBeenCalledTimes(1);

  // ensure order was saved to db
  const orders = await OrderModel.find({});
  expect(orders.length).toEqual(1);
  expect(orders[0].userId).toEqual(testUser.id);
  expect(orders[0].ticketId).toEqual(ticket.id);
  expect(orders[0].status).toEqual(OrderStatus.Pending);
});

it('return 400 if there has a pending order on that ticket', async () => {
  const { ticket, cookie } = await createNewOrder();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('return 400 if there has a paid order on that ticket', async () => {
  const { ticket, cookie, order } = await createNewOrder();

  const orderInDb = (await OrderModel.findById(order.id))!;
  orderInDb.status = OrderStatus.Paid;
  await orderInDb.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('can create an order if there has an expired order on that ticket', async () => {
  const { ticket, cookie, order } = await createNewOrder();

  const orderInDb = (await OrderModel.findById(order.id))!;
  orderInDb.status = OrderStatus.Expired;
  await orderInDb.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});

it('can create an order if there has a cancel order on that ticket', async () => {
  const { ticket, cookie, order } = await createNewOrder();

  const orderInDb = (await OrderModel.findById(order.id))!;
  orderInDb.status = OrderStatus.Canceled;
  await orderInDb.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(201);
});
