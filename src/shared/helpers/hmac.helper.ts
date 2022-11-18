import crypto from 'crypto';

export class HmacHelper {
  static hmac(message: string, secret: string, algorithm = 'sha256'): string {
    return crypto.createHmac(algorithm, secret).update(message).digest('hex');
  }

  static verify(
    message: string,
    secret: string,
    hmac: string,
    algorithm = 'sha256',
  ): boolean {
    return HmacHelper.hmac(message, secret, algorithm) === hmac;
  }
}
