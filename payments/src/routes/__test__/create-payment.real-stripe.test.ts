import { JwtHelper, OrderStatus } from '@hoangrepo/common';
import request from 'supertest';
import app from '../../app';
import { Order, OrderModel } from '../../models/order';
import { PaymentModel } from '../../models/payment';
import { natsInfo } from '../../nats-info';
import { stripe } from '../../stripe';

// Note: to run this test, we need to add STRIPE_KEY to environment variable in Windows

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

it('returns 500 when sending invalid token to strike API', async () => {
  const { order, cookie } = await setUp();

  await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token: 'Im invalid!',
      orderId: order.id,
    })
    .expect(500);
});

it('returns 201, create charge sucessful on happy case', async () => {
  const { order, cookie } = await setUp();

  const token = 'tok_visa';
  const res = await request(app)
    .post('/api/payments')
    .set('Cookie', cookie)
    .send({
      token,
      orderId: order.id,
    })
    .expect(201);

  // ensure the payment information has been saved to db
  const payment = await PaymentModel.findById(res.body.id);
  expect(payment).not.toBeNull();
  expect(payment?.orderId).toEqual(order.id);
  expect(payment?.userId).toEqual(order.userId);
  expect(payment?.price).toEqual(order.price);
  expect(payment?.stripeId).toBeDefined();

  // call stripe api to ensure the charge action succeeded
  const charge = await stripe.charges.retrieve(payment!.stripeId);
  expect(charge.id).toEqual(payment!.stripeId);
  expect(charge.amount).toEqual(order.price * 100);
  expect(charge.currency).toEqual('usd');

  // ensure it publishes an event
  expect(natsInfo.client.publish).toHaveBeenCalledTimes(1);
});
