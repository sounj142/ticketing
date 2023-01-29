import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

jest.mock('../utils/nats-client');

let mongo: MongoMemoryServer;
beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  mongoose.set('strictQuery', true);
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

// in test enviroment, we need a private key to generate test cookies
process.env.JWT_PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEoQIBAAKCAQB6U6yexur9VSyvysOFwc3gxNV19Aep7Vg7l6siztC7vfrnT3tt
fBHzupsvzBheiaD9ptlS2IB3sERAJZA/NxekdgMwUX5hySRBCPYFHZ+B21mK0o7b
Wmh9L3jKHIaVs98QMyJOk8J25NSAAJ1GltOo452FEaMIpIJHhGMH2RbTlGc83+gu
EJp6SZyHC3mKGfuzsFZcJthEiWy015rhPeLA0NtZ3o5w7WBzFkCvYIB9usw2fmpF
duGRha2U+LF/LJNUzj9p2ZEHg/ZRbpKrYOcjyOU9qhuDpdsUEoxfya0gps9uia1u
ha5llH6GnWZHDyzFvzq/hBsFK4vT9yUjkex5AgMBAAECggEAHf7ChzRzjqcCDCEG
DJhXKVRam0+5SVuflQ09s41O9ZpCGdINi+0uYbtSLkg3eYb56PiutXfNGIwqUChl
1Hpn27XsVj7FZKjzsNbHrL10zVzB+h5jVTo4AOpRDg4smiy+97PyJ55nwsudp71+
0z5MrE8T4vtOJOJh57N4rQX4aOzTVClGvBheKcJXMJwVC1MuioQNgT4bj9hsjDVs
sZ0iwfIWTKjIxZ98AqStRvk/lP8EOLTs0fO+5R9kipFmLng38Wke/MujF6orLbQk
T+JEc2EiFjJQrOiDVTYQfmTOkkS6L+IPkUHcpVofFRvEoLgQBUd3c50YPtlqwdFD
R+rSAQKBgQDjaUeeaAIoXGagkZe3aKjwna/QSWD82jGe4GX1x/Agoy4gG3Rkz88Q
1xdFqEwTvQ55ovR6EtsrA2ci4L1UtftaA/p2f671qWvbK6qUZWrp4g1dI1TVfvmS
rT3bL5DfEnjlnKHfRvx7++CqHC17hlijbB4iCXhPOmWyxc1OINkEWQKBgQCJtH1B
kEo+d/r982y4/v8kzWHbiOLmsd7KicNaXoH4zZ7G3G0SLGit8lPLdyALisFlF3y5
QYq3yKytZp7Rv5BijJzZzVrABLR/EH5YgIsXc6otFni4cSvZTuGZsyX1vJBKqp4O
hhNQcChuwsXpubl83wmu6qvNYtEqJxwneMOlIQKBgFNjBFbqbngcQal5GXewUdpB
B/nJHl45J97JC7oPAVcGXuB5ELnylUvogukQ6CyIs2kYvqqQhXsFOWlJnUMVo8AD
G3EeKqp74EeygE7/zS9Lq3jOfsn2UE9fZQIdM/MIE/ql75kur2BLILtfr7HOtmve
NkJm1I3ArQ/bhgey9cCpAoGAaaMHD5vECMX7yoLJ3eToD/BqaIJLJhQ/R/qE3Tdw
10/NxNnl5jIhH4etVoGNGK2aDJYG/QrVgoU0SlVV8qvU9HTQAplxS6qQWIVrlzMN
ALGfU7VQaJWQwMStdj4jGa9MtarLU3LxMBzKN6W9M75hF/T1tbSalRWARaj5BSK0
W2ECgYAefRFs2AWhle38GytEl8VvT77b2VSMF8RLvHLa1M8CX0KRW2lH3Wy0bKXC
Y+Pb4NshgrgZPd6yOLtB45fFgU2yhhn90sGEPRCNCJOZHNQ1V+a9ni25ScTYx7Kx
wc0HxX9PovW6yg49+FkfLMDV0eOUQXMaUGMRMsbtzu+sVxJmTA==
-----END RSA PRIVATE KEY-----`;

process.env.JWT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQB6U6yexur9VSyvysOFwc3g
xNV19Aep7Vg7l6siztC7vfrnT3ttfBHzupsvzBheiaD9ptlS2IB3sERAJZA/Nxek
dgMwUX5hySRBCPYFHZ+B21mK0o7bWmh9L3jKHIaVs98QMyJOk8J25NSAAJ1GltOo
452FEaMIpIJHhGMH2RbTlGc83+guEJp6SZyHC3mKGfuzsFZcJthEiWy015rhPeLA
0NtZ3o5w7WBzFkCvYIB9usw2fmpFduGRha2U+LF/LJNUzj9p2ZEHg/ZRbpKrYOcj
yOU9qhuDpdsUEoxfya0gps9uia1uha5llH6GnWZHDyzFvzq/hBsFK4vT9yUjkex5
AgMBAAE=
-----END PUBLIC KEY-----`;

process.env.EXPIRATION_WINDOW_SECONDS = '900';
