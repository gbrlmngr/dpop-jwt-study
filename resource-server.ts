import { randomUUID, randomBytes } from 'node:crypto';
import { importJWK, jwtVerify, type GenerateKeyPairResult } from "jose";

export class ResourceServer {
  private readonly algorithm: string;

  constructor(algorithm: string = 'ES256') {
    this.algorithm = algorithm;
  }

  public async verifyAccess(
    accessToken: string,
    dPoPToken: string,
    authorizationServerPublicKey: GenerateKeyPairResult['publicKey']
  ) {
    try {
      const { payload: accessTokenPayload } = await jwtVerify(accessToken, authorizationServerPublicKey, { algorithms: [this.algorithm] });

      if (accessTokenPayload.typ !== 'dpop+jwt') throw new Error();
      if (accessTokenPayload.iss !== 'https://authorization.server') throw new Error();
      if (accessTokenPayload.aud !== 'https://resource.server') throw new Error();

      const confirmedJWKObject = JSON.parse(
        Buffer.from((accessTokenPayload.cnf! as { jkt: string }).jkt, 'base64').toString('utf8')
      );
      const confirmedJWK = await importJWK(confirmedJWKObject);
      const { payload: dPoPTokenPayload } = await jwtVerify(dPoPToken, confirmedJWK);

      if (dPoPTokenPayload.htu !== 'https://resource.server/my_resource') throw new Error();
      if (dPoPTokenPayload.htm !== 'POST') throw new Error();

      return this.mapScopesToFields((accessTokenPayload.scopes as string)?.split(/\s+/g));
    } catch {
      return null;
    }
  }

  private mapScopesToFields(scopes: string[]): Record<string, any> {
    const fields: Record<string, any> = {
      /* Default fields */
      last_login: Date.now(),
    };

    if (scopes.includes('read.activities')) {
      fields['activities'] = [{
        activity_id: randomUUID(),
      }, {
        activity_id: randomUUID(),
      }];
    }

    if (scopes.includes('audit.state')) {
      fields['last_state_update_timestamp'] = Date.now(),
      fields['last_state_update_author'] = `user_${randomBytes(8).toString('hex')}`
    }

    return fields;
  }
}
