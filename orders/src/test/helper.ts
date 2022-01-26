import { JwtHelper } from '@hoangrepo/common';
import request from 'supertest';
import app from '../app';

export async function createNewTicket() {
  const cookie = JwtHelper.generateCookieForTest();

  const inputData = {
    title: 'test title',
    price: 100,
  };
  const res = await request(app)
    .post('/api/orders')
    .set('Cookie', cookie)
    .send(inputData)
    .expect(201);

  return { res, inputData };
}
