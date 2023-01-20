import request from 'supertest';
import app from '../../app';
import { createNewTicket } from '../../test/helper';

it('returns 404 error if the ticket id is not exist in db', async () => {
  await request(app).get('/api/tickets/4342').send().expect(404);

  await request(app)
    .get('/api/tickets/61ea90014a0a5e110631163b')
    .send()
    .expect(404);
});

it('after create a ticket, receive it in the next get by id request', async () => {
  const { ticket } = await createNewTicket();

  const res = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .send()
    .expect(200);

  expect(res.body.title).toEqual(ticket.title);
  expect(res.body.price).toEqual(ticket.price);
});
