import { JwtHelper, OrderStatus } from '@hoangrepo/common';
import request from 'supertest';
import app from '../../app';
import { Order, OrderModel } from '../../models/order';
import { PaymentModel } from '../../models/payment';
import { natsInfo } from '../../nats-info';
import { stripe } from '../../stripe';

jest.mock('../../stripe', () => {
  return {
    __esModule: true,
    stripe: {
      charges: {
        create: jest.fn().mockResolvedValue({ id: '61fceed7cfc9689bafd1282a' }),
      },
    },
  };
});

async function setUp() {
  const user = {
    id: '61ea90014a0a5e110631162a',
    email: 'test@test.com',
  };

  const cookie = JwtHelper.generateCookieForTest(user);

  const order = new OrderModel<Order>({
    _id: '61f12948e67a2571aacee969',
    userId: user.id,
    price: 10,
    status: OrderStatus.Created,
  });

  await order.save();

  return { order, user, cookie };
}

it('returns 401 if anonymous tries to create charge', async () => {
  await request(app)
    .post('/api/payments')
    .send({
      token: 'test token',
      orderId: '61f12948e67a2571aacee969',
    })
    .expect(401);
});

it('returns a 400 on invalid token', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: '',
      orderId: '61f12948e67a2571aacee969',
    })
    .expect(400);
});

it('returns a 400 on invalid orderId', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'test token',
    })
    .expect(400);
});

it('returns a 404 if order does not exist', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'test token',
      orderId: '61f12948e67a2571aacee969',
    })
    .expect(404);
});

it('returns a 400 if user tries to pay an order belongs to others', async () => {
  const { order } = await setUp();

  await request(app)
    .post('/api/payments')
    .set('Cookie', JwtHelper.generateCookieForTest())
    .send({
      token: 'test token',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 400 if user tries to pay a cancelled order', async () => {
  const { order, cookie } = await setUp();

  order.status = OrderStatus.Cancelled;
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'test token',
      orderId: order.id,
    })
    .expect(400);
});

it('returns a 400 if user tries to pay a complete order', async () => {
  const { order, cookie } = await setUp();

  order.status = OrderStatus.Complete;
  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'test token',
      orderId: order.id,
    })
    .expect(400);
});

it('returns 201, create charge sucessful on happy case', async () => {
  const { order, cookie } = await setUp();

  const token = 'test token';
  const res = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token,
      orderId: order.id,
    })
    .expect(201);

  // ensure stripe api has been called
  expect(stripe.charges.create).toHaveBeenCalledTimes(1);
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.source).toEqual(token);
  expect(chargeOptions.amount).toEqual(order.price * 100);
  expect(chargeOptions.currency).toEqual('usd');
  const chargeResult = await (stripe.charges.create as jest.Mock).mock
    .results[0].value;

  // ensure the payment information has been saved to db
  const payment = await PaymentModel.findById(res.body.id);
  expect(payment).toBeDefined();
  expect(payment?.orderId).toEqual(order.id);
  expect(payment?.userId).toEqual(order.userId);
  expect(payment?.price).toEqual(order.price);
  expect(payment?.stripeId).toEqual(chargeResult.id);

  // ensure it publishes an event
  expect(natsInfo.client.publish).toHaveBeenCalledTimes(1);
});
