import { JwtHelper } from '@hoangorg/common';
import request from 'supertest';
import app from '../../app';
import { createNewOrder } from '../../test/helper';

it('returns 401 if anonymous tries to get order', async () => {
  await request(app)
    .get('/api/orders/61ea90014a0a5e110631163b')
    .send()
    .expect(401);
});

it('returns 404 error if the order id is not exist in db', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .get('/api/orders/434234')
    .set('Cookie', cookie)
    .send()
    .expect(404);

  await request(app)
    .get('/api/orders/61ea90014a0a5e110631163b')
    .set('Cookie', cookie)
    .send()
    .expect(404);
});

it('after create an order, can receive it in the next get by id request', async () => {
  const { order, cookie } = await createNewOrder();

  const res = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.ticketId).toEqual(order.ticketId);
  expect(res.body.userId).toEqual(order.userId);
  expect(res.body.id).toEqual(order.id);
});

it('return 403 if user try to get the order belong to others', async () => {
  const { order } = await createNewOrder();

  const otherUserCookie = JwtHelper.generateCookieForTest({
    id: '61f12948e67a2571aacee969',
    email: 'aaaa@aaaa.com',
  });

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', otherUserCookie)
    .send()
    .expect(403);
});
