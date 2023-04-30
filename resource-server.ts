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
      const { payload } = await jwtVerify(accessToken, authorizationServerPublicKey, { algorithms: [this.algorithm] });
      const confirmedJWKObject = JSON.parse(
        Buffer.from((payload.cnf! as { jwk: string }).jwk, 'base64').toString('utf8')
      );
      const confirmedJWK = await importJWK(confirmedJWKObject);
      await jwtVerify(dPoPToken, confirmedJWK);

      return this.mapScopesToFields((payload.scopes as string)?.split(/\s+/g));
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
        activityId: randomUUID(),
      }, {
        activityId: randomUUID(),
      }];
    }

    if (scopes.includes('audit.state')) {
      fields['last_state_update_timestamp'] = Date.now(),
      fields['last_state_update_author'] = `user_${randomBytes(8).toString('hex')}`
    }

    return fields;
  }
}
