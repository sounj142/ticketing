import request from 'supertest';
import app from '../../app';
import { signUpAsTestUser } from '../../test/helper';

it('returns null when unauthentication', async () => {
  const res = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200);

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

it('returns user jwt data when send Bearer header token', async () => {
  const authResponse = await request(app)
    .post('/api/users/signup?dontUseCookie=true')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
  const jwt = authResponse.body.token;

  const res = await request(app)
    .get('/api/users/currentuser')
    .set('authorization', `Bearer ${jwt}`)
    .send()
    .expect(200);

  expect(res.body.email).toEqual('test@test.com');
});
