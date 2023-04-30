import { randomUUID, randomBytes } from 'node:crypto';
import { importJWK, jwtVerify, SignJWT, type GenerateKeyPairResult, type KeyLike } from "jose";

export class AuthorizationServer {
  private readonly keyPair: GenerateKeyPairResult;
  private readonly algorithm: string;

  constructor(keyPair: GenerateKeyPairResult, algorithm: string = 'ES256') {
    this.keyPair = keyPair;
    this.algorithm = algorithm;
  }

  public async generateAccessTokenJWT(dPoPToken: string, scopes: string): Promise<string> {
    const { jwk: clientPublicKeyJWK, raw: clientPublicKeyJWKRaw } = await this.parseJWKFromDPoPToken(dPoPToken);
    await jwtVerify(dPoPToken, clientPublicKeyJWK);

    return await new SignJWT({
      typ: 'dpop+jwt',
      jti: randomUUID(),
      iss: 'https://authorization.server',
      aud: 'https://resource.server',
      sub: `user_${randomBytes(8).toString('hex')}`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
      cnf: {
        jwk: Buffer.from(
          JSON.stringify(clientPublicKeyJWKRaw)
        ).toString('base64')
      },
      access_token: randomBytes(16).toString('hex'),
      scopes,
    })
      .setProtectedHeader({ alg: this.algorithm })
      .sign(this.keyPair.privateKey);
  }

  private async parseJWKFromDPoPToken(dPoPToken: string): Promise<{ jwk: KeyLike | Uint8Array, raw: object }> {
    const [, content,] = dPoPToken.split('.');
    const jwkObject = JSON.parse(Buffer.from(content, 'base64').toString('utf8')).jwk;
    const jwk = await importJWK(jwkObject);

    return {
      jwk,
      raw: jwkObject,
    };
  }
}
