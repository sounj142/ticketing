import { JwtHelper } from '@hoangrepo/common';
import request from 'supertest';
import app from '../../app';
import { TicketModel } from '../../models/ticket';
import { natsInfo } from '../../nats-info';
import { createNewTicket } from '../../test/helper';

it('returns 401 if anonymous tries to update ticket', async () => {
  await request(app)
    .put('/api/tickets/324234242343')
    .send({
      title: 'test title',
      price: 100,
    })
    .expect(401);
});

it('returns a 404 when ticket does not exist', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .put('/api/tickets/4235445345')
    .set('Cookie', cookie)
    .send({
      title: 'ticket title',
      price: 100,
    })
    .expect(404);

  await request(app)
    .put('/api/tickets/61ea90014a0a5e110631163b')
    .set('Cookie', cookie)
    .send({
      title: 'ticket title',
      price: 100,
    })
    .expect(404);
});

it('returns a 400 on invalid title', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .put('/api/tickets/61ea90014a0a5e110631163b')
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 100,
    })
    .expect(400);
});

it('returns a 400 on invalid price', async () => {
  const cookie = JwtHelper.generateCookieForTest();

  await request(app)
    .put('/api/tickets/61ea90014a0a5e110631163b')
    .set('Cookie', cookie)
    .send({
      title: 'test title',
      price: -10,
    })
    .expect(400);

  await request(app)
    .put('/api/tickets/61ea90014a0a5e110631163b')
    .set('Cookie', cookie)
    .send({
      title: 'test title',
    })
    .expect(400);
});

it('return 403 if user try to edit ticket of other user', async () => {
  const createResponse = await createNewTicket();

  await request(app)
    .put(`/api/tickets/${createResponse.res.body.id}`)
    .set(
      'Cookie',
      JwtHelper.generateCookieForTest({
        id: '61ebb402c4bc224a757d4ad6',
        email: 'otheruser@test.com',
      })
    )
    .send({
      title: 'updated title',
      price: 999,
    })
    .expect(403);

  const ticket = await TicketModel.findById(createResponse.res.body.id);
  expect(ticket!.title).toEqual(createResponse.inputData.title);
  expect(ticket!.price).toEqual(createResponse.inputData.price);
});

it('update a ticket with valid inputs', async () => {
  const createResponse = await createNewTicket();
  const cookie = JwtHelper.generateCookieForTest();

  const title = 'updated title';
  const price = 999;
  const res = await request(app)
    .put(`/api/tickets/${createResponse.res.body.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  expect(res.body.title).toEqual(title);
  expect(res.body.price).toEqual(price);

  // ensure it publishes an event
  expect(natsInfo.client.publish).toHaveBeenCalledTimes(2);

  // ensure ticket was saved to db
  const tickets = await TicketModel.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].userId).toEqual(createResponse.res.body.userId);
});
