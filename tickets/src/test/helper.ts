import { JwtHelper } from '@hoangorg/common';
import request from 'supertest';
import app from '../app';

export async function createNewTicket() {
  const cookie = JwtHelper.generateCookieForTest();

  const res = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'test title',
      price: 100,
    })
    .expect(201);

  return { ticket: res.body, cookie };
}
