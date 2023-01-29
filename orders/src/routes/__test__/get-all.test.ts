import { JwtHelper } from '@hoangorg/common';
import request from 'supertest';
import app from '../../app';
import { createNewOrder } from '../../test/helper';

it('returns 401 if anonymous tries to get order', async () => {
  await request(app).get('/api/orders').send().expect(401);
});

it('returns empty array if there are no orders in db', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.length).toEqual(0);
});

it('after user create an order, he should receive it in the next get all request', async () => {
  const { order, cookie } = await createNewOrder();

  const res = await request(app)
    .get('/api/orders')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.length).toEqual(1);
  expect(res.body[0].ticketId).toEqual(order.ticketId);
  expect(res.body[0].id).toEqual(order.id);
  expect(res.body[0].userId).toEqual(order.userId);
});

it('user can not get orders belongs to others', async () => {
  const { cookie } = await createNewOrder();

  const correctUserResponse = await request(app)
    .get('/api/orders')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(correctUserResponse.body.length).toEqual(1);

  const otherUserCookie = JwtHelper.generateCookieForTest({
    id: '61f12948e67a2571aacee969',
    email: 'aaaa@aaaa.com',
  });

  const otherUserResponse = await request(app)
    .get('/api/orders')
    .set('Cookie', otherUserCookie)
    .send()
    .expect(200);

  expect(otherUserResponse.body.length).toEqual(0);
});
