import request from 'supertest';
import app from '../app';

export async function signUpAsTestUser() {
  const authResponse = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const cookie = authResponse.get('Set-Cookie');
  return cookie;
}
