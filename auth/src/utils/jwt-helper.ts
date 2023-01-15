import jwt, { JwtPayload } from 'jsonwebtoken';

const issuer = 'Hoang Corp';
const subject = 'hoang@hoang.com';
const algorithm = 'RS256';
//const jwtPrivateKey = process.env.JWT_PRIVATE_KEY!;
const jwtPrivateKey = process.env.JWT_PUBLIC_KEY!;
const jwtPublicKey = process.env.JWT_PUBLIC_KEY!;
const expiresIn = process.env.JWT_EXPIRES_IN!;

export interface UserPayload {
  id: string;
  email: string;
}

export class JwtHelper {
  static createToken(payload: UserPayload) {
    const signOptions: jwt.SignOptions = {
      issuer,
      subject,
      expiresIn,
      algorithm,
    };
    //return jwt.sign(payload, jwtPrivateKey, signOptions);
    return jwt.sign(payload, jwtPrivateKey);
  }

  static verifyToken(token: string): UserPayload | undefined {
    if (!token) return undefined;

    const verifyOptions: jwt.VerifyOptions = {
      issuer,
      subject,
      algorithms: [algorithm],
    };
    try {
      //const user = jwt.verify(token, jwtPublicKey, verifyOptions) as JwtPayload;
      const user = jwt.verify(token, jwtPublicKey) as JwtPayload;
      // if (!user?.exp) return undefined;
      // if (new Date(1000 * user.exp) < new Date()) return undefined;

      return user as UserPayload;
    } catch {
      console.log('Invalid JWT signature');
      return undefined;
    }
  }

  static generateCookieForTest(
    payload: { id: string; email: string } = {
      id: '61ea90014a0a5e110631163b',
      email: 'test@test.com',
    }
  ): string[] {
    const token = JwtHelper.createToken(payload);
    const session = { jwt: token };
    const sessionJson = JSON.stringify(session);
    const base64 = Buffer.from(sessionJson).toString('base64');

    return [`session=${base64}; path=/; secure; httponly`];
  }
}
