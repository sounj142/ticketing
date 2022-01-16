import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(crypto.pbkdf2);

export class Password {
  static async toHash(password: string): Promise<string> {
    // Creating a unique salt for a particular user
    const salt = crypto.randomBytes(32).toString('hex');

    // Hashing user's salt and password with 1000 iterations,
    const hash = (
      await pbkdf2Async(password, salt, 1000, 64, `sha512`)
    ).toString(`hex`);

    return `${hash}.${salt}`;
  }

  static async isCorrect(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    const [storedHash, salt] = storedPassword.split('.');
    const suppliedHash = (
      await pbkdf2Async(suppliedPassword, salt, 1000, 64, `sha512`)
    ).toString(`hex`);

    return suppliedHash === storedHash;
  }
}
