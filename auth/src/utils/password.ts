import crypto from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(crypto.pbkdf2);

export class Password {
  private static async createHash(password: string, salt: string) {
    return (await pbkdf2Async(password, salt, 1000, 64, `sha512`)).toString(
      `hex`
    );
  }

  static async toHash(password: string): Promise<string> {
    // Creating a unique salt for a particular user
    const salt = crypto.randomBytes(32).toString('hex');

    // Hashing user's salt and password with 1000 iterations,
    const hash = await Password.createHash(password, salt);

    return `${hash}.${salt}`;
  }

  static async isCorrect(
    storedPassword: string,
    suppliedPassword: string
  ): Promise<boolean> {
    const [storedHash, salt] = storedPassword.split('.');
    const suppliedHash = await Password.createHash(suppliedPassword, salt);

    return suppliedHash === storedHash;
  }
}
