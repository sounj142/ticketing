import request from 'supertest';
import app from '../../app';

it('returns a 400 on invalid email', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test',
      password: 'password',
    })
    .expect(400);
});

it('returns a 400 on invalid password', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: '',
    })
    .expect(400);
});

it('returns a 400 on invalid credentials', async () => {
  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookies after successful sign in', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  const res = await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(200);

  expect(res.get('Set-Cookie')).toBeDefined();
});

it('returns a 400 when login with incorrect password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password1',
    })
    .expect(400);
});
