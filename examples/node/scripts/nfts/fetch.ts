import { getAuthenticatedClient } from '../shared/getAuthenticatedClient';
import { setupWallet } from '../shared/setupWallet';

async function main() {
  const wallet = setupWallet();
  const client = await getAuthenticatedClient(wallet);

  const result = await client.nfts.fetch();

  console.log('Result: ', result);
}

main();
