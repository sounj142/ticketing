import request from 'supertest';
import app from '../../app';
import { signUpAsTestUser } from '../../test/helper';

it('returns a 200 on sign out', async () => {
  const cookie = await signUpAsTestUser();

  const res = await request(app)
    .post('/api/users/signout')
    .set('Cookie', cookie)
    .send()
    .expect(200);

  expect(res.get('Set-Cookie')[0]).toEqual(
    'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
  );
});
