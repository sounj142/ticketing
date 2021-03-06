import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.unmock('../stripe');
jest.mock('../nats-info');

let mongo: MongoMemoryServer;
beforeAll(async () => {
  configEnvironmentVariables();

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

function configEnvironmentVariables() {
  // in test enviroment, we need a private key to generate test cookies
  process.env.JWT_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIBOgIBAAJAdRuXGw+zdWbUlm0QjNX6r+WDra78TSyOlknsTWNeUR/NxvnC+7Gc
hLXx/tmfht5/Nf7oxaw4r0NG721Y5Y4zNwIDAQABAkA0Xs5Ib9EVY5MWYlfQY7Dk
EIO+nE6ARLjPROfEA/gd1rjM9fbzn36R4NaI14fGi8Ir2thNJ1sE0VkbkGI7mxXh
AiEA1lGpD2YUx9IgcSGgKv3lLyZo0w9G7fPlTCE0omgo+lsCIQCL4g6Y4IBELULM
bFFQNwudWZQpaxHSDNefFP7WdZepVQIhAK3kji6/XgcPuGDyrpmTbjyGhrERiTST
Gy5dFu7bYrxXAiBkk+vO/Ez9uFV5SsDEnm+ZedlQVo3/rAA1gBEj/nVH6QIhAI6t
TuPNn8eyH2S6X1OVQjX9JaxgvKZw91rqg382Xdhj
-----END RSA PRIVATE KEY-----`;

  process.env.JWT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFswDQYJKoZIhvcNAQEBBQADSgAwRwJAdRuXGw+zdWbUlm0QjNX6r+WDra78TSyO
lknsTWNeUR/NxvnC+7GchLXx/tmfht5/Nf7oxaw4r0NG721Y5Y4zNwIDAQAB
-----END PUBLIC KEY-----`;

  process.env.ACK_WAIT_IN_MILISECONDS = '5000';
}
