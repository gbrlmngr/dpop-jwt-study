import { randomUUID } from 'node:crypto';
import { exportJWK, SignJWT, type GenerateKeyPairResult, type JWK } from 'jose';

export class Client {
  private readonly keyPair: GenerateKeyPairResult;
  private readonly algorithm: string;

  constructor(keyPair: GenerateKeyPairResult, algorithm: string = 'ES256') {
    this.keyPair = keyPair;
    this.algorithm = algorithm;
  }

  public async generateDPoPToken(htu: string, htm: string = 'POST'): Promise<string> {
    const jwk = await this.exportJWK(this.keyPair.publicKey);

    return await new SignJWT({
      typ: 'dpop+jwt',
      jti: randomUUID(),
      jwk,
      htu,
      htm,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60, // 1 minute,
      eua: Buffer.from(
        /* Base64 over navigator.userAgent (eua = encoded user-agent) */
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
      ).toString('base64')
    })
      .setProtectedHeader({ alg: this.algorithm })
      .sign(this.keyPair.privateKey);
  }

  private async exportJWK(publicKey: GenerateKeyPairResult['publicKey']): Promise<JWK> {
    return await exportJWK(publicKey);
  }
}
