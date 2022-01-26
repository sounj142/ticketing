import { JwtHelper } from '@hoangrepo/common';
import request from 'supertest';
import app from '../app';
import { Ticket, TicketModel } from '../models/ticket';

export const testUser = {
  id: '61ea90014a0a5e110631163b',
  email: 'test@test.com',
};

export const testTicket = {
  title: 'test ticket',
  price: 100,
  userId: testUser.id,
  version: 1,
};

export async function createNewTicket() {
  const ticketModel = new TicketModel<Ticket>(testTicket);
  ticketModel.save();

  return {
    ...testTicket,
    id: ticketModel.id,
  };
}

export async function createNewOrder() {
  const cookie = JwtHelper.generateCookieForTest(testUser);
  const ticket = await createNewTicket();

  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send({ ticketId: ticket.id })
    .expect(201);

  return { ticket, order: res.body, cookie };
}
