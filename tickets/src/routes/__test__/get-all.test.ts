import request from 'supertest';
import app from '../../app';
import { createNewTicket } from '../../test/helper';

it('returns empty array if there are no tickets in db', async () => {
  const res = await request(app).get('/api/tickets').send().expect(200);

  expect(res.body.length).toEqual(0);
});

it('after create a ticket, receive it in the next get all request', async () => {
  const { ticket } = await createNewTicket();

  const res = await request(app).get('/api/tickets').send().expect(200);

  expect(res.body.length).toEqual(1);
  expect(res.body[0].title).toEqual(ticket.title);
});
