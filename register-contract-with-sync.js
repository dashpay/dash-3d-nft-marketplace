require('dotenv').config();
const Dash = require('dash');
const fs = require('fs');

async function registerContract() {
  if (!process.env.DASH_IDENTITY_ID || !process.env.DASH_PRIVATE_KEY) {
    console.error('❌ Missing required environment variables!');
    process.exit(1);
  }

  const client = new Dash.Client({
    network: 'testnet',
    wallet: {
      mnemonic: null,
      privateKey: process.env.DASH_PRIVATE_KEY,
      unsafeOptions: {
        skipSynchronizationBeforeHeight: 650000 // Skip old blocks for faster sync
      }
    },
    apps: {
      nft3d: {
        contractId: '11111111111111111111111111111111' // Placeholder
      }
    }
  });

  try {
    console.log('1. Getting wallet account...');
    const account = await client.getWalletAccount();
    console.log('   Account address:', account.getUnusedAddress().address);
    
    const identityId = process.env.DASH_IDENTITY_ID;
    console.log('\n2. Target Identity ID:', identityId);
    
    // Try to sync identities
    console.log('\n3. Syncing wallet identities...');
    const identityIds = account.identities.getIdentityIds();
    console.log('   Current wallet identities:', identityIds);
    
    // Fetch the identity directly from platform
    console.log('\n4. Fetching identity from platform...');
    const platformIdentity = await client.platform.identities.get(identityId);
    
    if (!platformIdentity) {
      throw new Error('Identity not found on platform');
    }
    
    console.log('   Identity found on platform!');
    console.log('   Balance:', platformIdentity.balance);
    
    // Load contract
    console.log('\n5. Loading contract definition...');
    const contractDefinition = JSON.parse(
      fs.readFileSync('./contracts/nft3d-contract-final.json', 'utf8')
    );
    
    console.log('   Contract loaded, document types:', Object.keys(contractDefinition));
    
    // Create the data contract using platform identity
    console.log('\n6. Creating data contract...');
    const dataContract = await client.platform.contracts.create(contractDefinition, platformIdentity);
    
    console.log('   Contract created locally');
    console.log('   Contract ID will be:', dataContract.getId().toString());
    
    // Try to publish without wallet association
    console.log('\n7. Publishing contract to network...');
    console.log('   Using identity from platform directly...');
    
    // This might fail if the SDK requires wallet association
    // But let's try it
    await client.platform.contracts.publish(dataContract, platformIdentity);
    
    const contractId = dataContract.getId().toString();
    console.log('\n✅ SUCCESS! Contract published!');
    console.log('   Contract ID:', contractId);
    
    // Update .env
    let envContent = fs.readFileSync('.env', 'utf8');
    if (envContent.includes('NEXT_PUBLIC_TESTNET_CONTRACT_ID=')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_TESTNET_CONTRACT_ID=.*/,
        `NEXT_PUBLIC_TESTNET_CONTRACT_ID=${contractId}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_TESTNET_CONTRACT_ID=${contractId}`;
    }
    
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Updated .env file with contract ID');
    
    return contractId;
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('not associated with wallet')) {
      console.log('\n📝 Note: The SDK requires the identity to be in the wallet.');
      console.log('   Since we have the correct private key, let\'s try a different approach...');
      
      // Alternative: Try to register the contract using a direct platform call
      console.log('\n   You may need to use the Dash Platform CLI or REST API directly.');
      console.log('   The contract definition is ready in: contracts/nft3d-contract-final.json');
    }
    
    throw error;
  }
}

console.log('=== Dash Platform NFT Contract Registration ===');
console.log('Network: Testnet');
console.log('Using credentials from .env file\n');

registerContract()
  .then(contractId => {
    if (contractId) {
      console.log('\n=== Registration Complete ===');
    }
    process.exit(0);
  })
  .catch(error => {
    console.error('\n=== Registration Failed ===');
    process.exit(1);
  });