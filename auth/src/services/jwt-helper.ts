import jwt from 'jsonwebtoken';

const issuer = 'Hoang Corp';
const subject = 'hoang@hoang.com';
const algorithm = 'RS256';

export interface UserPayload {
  id: string;
  email: string;
}

export class JwtHelper {
  static createToken(payload: any) {
    const signOptions: jwt.SignOptions = {
      issuer,
      subject,
      expiresIn: '1h',
      algorithm,
    };
    return jwt.sign(payload, process.env.JWT_PRIVATE_KEY!, signOptions);
  }

  static verifyToken(token: string): UserPayload | undefined {
    if (!token) return undefined;

    const verifyOptions: jwt.VerifyOptions = {
      issuer,
      subject,
      algorithms: [algorithm],
    };
    try {
      const user = jwt.verify(
        token,
        process.env.JWT_PUBLIC_KEY!,
        verifyOptions
      );
      if (!user?.exp) return undefined;
      if (new Date(1000 * user.exp) < new Date()) return undefined;

      return user as UserPayload;
    } catch {
      console.log('Invalid JWT signature');
      return undefined;
    }
  }
}
