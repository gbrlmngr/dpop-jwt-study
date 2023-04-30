import { generateKeyPair } from 'jose';
import { Client } from './client';
import { AuthorizationServer } from './authorization-server';
import { ResourceServer } from './resource-server';

async function main() {
  const algorithm = 'ES256';
  const clientKeyPair = await generateKeyPair(algorithm, { extractable: true });
  const authorizationServerKeyPair = await generateKeyPair(algorithm);

  const client = new Client(clientKeyPair, algorithm);
  const authorizationServer = new AuthorizationServer(authorizationServerKeyPair, algorithm);
  const resourceServer = new ResourceServer(algorithm);

  /**
   * 1) Client emits a new DPoP token that will be used
   * by the Authorization Server to generate a new access token
   */
  const clientAuthorizationDPoPToken = await client.generateDPoPToken('https://authorization.server/request_access_token');
  const accessToken = await authorizationServer.generateAccessTokenJWT(clientAuthorizationDPoPToken, '');

  /**
   * 2) Resource server expects a valid access token
   * and a dedicated DPoP token from the Client
   */
  const clientResourceDPoPToken = await client.generateDPoPToken('https://resource.server/my_resource');
  const resourceServerResponse = await resourceServer.verifyAccess(
    accessToken,
    clientResourceDPoPToken,
    authorizationServerKeyPair.publicKey,
  );

  console.log({ resourceServerResponse });
}

main();
