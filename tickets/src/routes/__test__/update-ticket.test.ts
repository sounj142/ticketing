import { JwtHelper } from '@hoangorg/common';
import request from 'supertest';
import app from '../../app';
import Ticket from '../../models/ticket';
// import { natsInfo } from '../../nats-info';
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

it('return 403 if user try to edit ticket belongs to other user', async () => {
  const { ticket: createdTicket } = await createNewTicket();

  await request(app)
    .put(`/api/tickets/${createdTicket.id}`)
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

  const ticket = await Ticket.findById(createdTicket.id);
  expect(ticket!.title).toEqual(createdTicket.title);
  expect(ticket!.price).toEqual(createdTicket.price);
});

it('update a ticket with valid inputs', async () => {
  const { ticket, cookie } = await createNewTicket();

  const title = 'updated title';
  const price = 999;
  const res = await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set('Cookie', cookie)
    .send({
      title,
      price,
    })
    .expect(200);

  expect(res.body.title).toEqual(title);
  expect(res.body.price).toEqual(price);

  // // ensure it publishes an event
  // expect(natsInfo.client.publish).toHaveBeenCalledTimes(2);

  // ensure ticket was saved to db
  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
  expect(tickets[0].userId).toEqual(ticket.userId);
});

// it('return 400 if user try to update a reserved ticket', async () => {
//   const { ticket, cookie } = await createNewTicket();

//   // set orderId to ticket
//   const ticketData = await Ticket.findById(ticket.id);

//   ticketData!.orderId = '61f367fd3bbf580d5a10da24';
//   await ticketData!.save();

//   await request(app)
//     .put(`/api/tickets/${ticket.id}`)
//     .set('Cookie', cookie)
//     .send({
//       title: 'updated title',
//       price: 999,
//     })
//     .expect(400);
// });
