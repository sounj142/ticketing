import request from 'supertest';
import { JwtHelper, OrderStatus } from '@hoangorg/common';
import app from '../../app';
import Order from '../../models/order';
import { createNewOrder, testUser } from '../../test/helper';
import { natsInfo } from '../../utils/nats-client';

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
      ticketId: '656',
    })
    .expect(400);

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send()
    .expect(400);
});

it('returns a 404 if ticket not found', async () => {
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
  expect(order.ticket.id).toEqual(ticket.id);

  // ensure it publishes an event
  expect(natsInfo.client.publish).toHaveBeenCalledTimes(1);

  // ensure order was saved to db
  const orders = await Order.find({}).populate('ticket');
  expect(orders.length).toEqual(1);
  expect(orders[0].userId).toEqual(testUser.id);
  expect(orders[0].status).toEqual(OrderStatus.Created);
  expect(orders[0].ticketId).toEqual(ticket.id);
  expect(orders[0].ticket.id).toEqual(ticket.id);
});

it('return 400 if there has a created order on that ticket', async () => {
  const { ticket, cookie } = await createNewOrder();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('return 400 if there has a complete order on that ticket', async () => {
  const { ticket, cookie, order } = await createNewOrder();

  const orderInDb = (await Order.findById(order.id))!;
  orderInDb.status = OrderStatus.Complete;
  await orderInDb.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('return 400 if there has a awaiting payment order on that ticket', async () => {
  const { ticket, cookie, order } = await createNewOrder();

  const orderInDb = (await Order.findById(order.id))!;
  orderInDb.status = OrderStatus.AwaitingPayment;
  await orderInDb.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({
      ticketId: ticket.id,
    })
    .expect(400);
});

it('can create an order if there has only an cancelled order on that ticket', async () => {
  const { ticket, cookie, order } = await createNewOrder();

  const orderInDb = (await Order.findById(order.id))!;
  orderInDb.status = OrderStatus.Cancelled;
  await orderInDb.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);
});
