jest.mock('../nats-info');

beforeAll(async () => {
  configEnvironmentVariables();
});

beforeEach(async () => {
  jest.clearAllMocks();
});

afterAll(async () => {});

function configEnvironmentVariables() {
  process.env.ACK_WAIT_IN_MILISECONDS = '5000';
}
