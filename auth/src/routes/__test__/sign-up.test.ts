import request from 'supertest';
import app from '../../app';

it('returns a 201 on successful sign up', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);
});

it('returns a 400 on invalid email', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test',
      password: 'password',
    })
    .expect(400);

  expect(res.body.errors.length).toEqual(1);
  expect(res.body.errors[0].message).toStrictEqual('Email must be a valid email.');
  expect(res.body.errors[0].field).toStrictEqual('email');
});

it('returns a 400 on invalid password', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: '',
    })
    .expect(400);
});

it('returns a 400 on email has already been in use', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

it('sets a cookies after successful sign up', async () => {
  const res = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeDefined();
  expect(res.body.jwt).toBeUndefined();
});

it('if dontUseCookie applied, request body should have jwt token when successful sign up', async () => {
  const res = await request(app)
    .post('/api/users/signup?dontUseCookie=true')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(res.get('Set-Cookie')).toBeUndefined();
  expect(res.body.jwt).toBeDefined();
});
