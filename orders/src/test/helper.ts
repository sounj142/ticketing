import { JwtHelper } from '@hoangorg/common';
import request from 'supertest';
import app from '../app';
import Ticket from '../models/ticket';

export const testUser = {
  id: '61ea90014a0a5e110631163b',
  email: 'test@test.com',
};

export const testTicket = {
  title: 'test ticket',
  price: 100,
  userId: testUser.id,
  version: 1,
  _id: '61f16e35e8ce351cc1232f03',
};

export async function createNewTicket() {
  const ticket = Ticket.build(testTicket);
  await ticket.save();

  return {
    ...testTicket,
    id: ticket.id,
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
