import jwt from 'jsonwebtoken';

export class JwtHelper {
  static createToken(payload: any) {
    const signOptions: jwt.SignOptions = {
      issuer: 'Hoang Corp',
      subject: 'hoang@hoang.com',
      //audience: 'https://ticketing.vn',
      expiresIn: '1h',
      algorithm: 'RS256',
    };
    return jwt.sign(payload, process.env.JWT_PRIVATE_KEY!, signOptions);
  }

  static verifyToken(token: string): any {
    const verifyOptions: jwt.VerifyOptions = {
      issuer: 'Hoang Corp',
      subject: 'hoang@hoang.com',
      //audience: 'https://ticketing.vn',
      algorithms: ['RS256'],
    };
    try {
      return jwt.verify(token, process.env.JWT_PUBLIC_KEY!, verifyOptions);
    } catch {
      console.log('Invalid JWT signature');
      return null;
    }
  }
}
