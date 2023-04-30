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
    try {
      const { jwk: clientPublicKeyJWK, raw: clientPublicKeyJWKRaw } = await this.parseJWKFromDPoPToken(dPoPToken);
      const { payload } = await jwtVerify(dPoPToken, clientPublicKeyJWK);

      if (payload.typ !== 'dpop+jwt') throw new Error();
      if (payload.htu !== 'https://authorization.server/request_access_token') throw new Error();
      if (payload.htm !== 'POST') throw new Error();
      if (
        Buffer.from((payload.eua as string), 'base64').toString('utf8') 
        !== 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.246'
      ) throw new Error();

      return await new SignJWT({
        typ: 'dpop+jwt',
        jti: randomUUID(),
        iss: 'https://authorization.server',
        aud: 'https://resource.server',
        sub: `user_${randomBytes(8).toString('hex')}`,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
        cnf: {
          jkt: Buffer.from(
            JSON.stringify(clientPublicKeyJWKRaw)
          ).toString('base64')
        },
        scopes,
      })
        .setProtectedHeader({ alg: this.algorithm })
        .sign(this.keyPair.privateKey);
    } catch {
      return '';
    }
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
