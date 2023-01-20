import { JwtHelper } from '@hoangorg/common';
import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket';
// import { natsInfo } from '../../nats-info';

it('post request to /api/tickets does not return 404', async () => {
  const res = await request(app).post('/api/tickets').send({});
  expect(res.statusCode).not.toEqual(404);
});

it('returns 401 if anonymous tries to create ticket', async () => {
  await request(app).post('/api/tickets').send({}).expect(401);
});

it('returns 400 error if invalid title', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 100,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      price: 100,
    })
    .expect(400);
});

it('returns a 400 on invalid price', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test title',
    })
    .expect(400);
});

it('create a ticket with valid inputs', async () => {
  const user = {
    id: '61ea90014a0a5e110631163b',
    email: 'test@test.com',
  };
  const cookie = JwtHelper.generateCookieForTest(user);

  const title = 'test title';
  const price = 100;
  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(201);

  expect(res.body.title).toEqual(title);
  expect(res.body.price).toEqual(price);
  expect(res.body.userId).toEqual(user.id);

  // // ensure it publishes an event
  // expect(natsInfo.client.publish).toHaveBeenCalledTimes(1);

  // ensure ticket was saved to db
  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].userId).toEqual(user.id);
});
