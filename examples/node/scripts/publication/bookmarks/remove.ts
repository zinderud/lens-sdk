import { getAuthenticatedClientFromEthersWallet } from '../../shared/getAuthenticatedClient';
import { setupWallet } from '../../shared/setupWallet';

async function main() {
  const wallet = setupWallet();
  const client = await getAuthenticatedClientFromEthersWallet(wallet);

  await client.publication.bookmarks.remove({
    on: '0x123-0x456',
  });

  console.log('Successfully removed bookmark');
}

main();