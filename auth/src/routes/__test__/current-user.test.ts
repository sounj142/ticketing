import request from 'supertest';
import app from '../../app';
import { signUpAsTestUser } from '../../test/helper';

it('returns null when unauthentication', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(400);

  expect(res.body).toBeNull();
});

it('returns user jwt data when authentication', async () => {
  const cookie = await signUpAsTestUser();

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.body.email).toEqual('test@test.com');
});
