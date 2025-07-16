const Dash = require('dash');
const fs = require('fs');

async function registerContract() {
  const client = new Dash.Client({
    network: 'testnet',
    wallet: {
      mnemonic: null,
      privateKey: 'XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf'
    }
  });

  try {
    console.log('1. Getting wallet account...');
    const account = await client.getWalletAccount();
    console.log('   Account address:', account.getUnusedAddress().address);
    
    // First, let's check if the identity exists and has credits
    const identityId = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';
    console.log('\n2. Fetching identity from platform...');
    
    const identity = await client.platform.identities.get(identityId);
    if (!identity) {
      throw new Error('Identity not found on platform');
    }
    
    console.log('   Identity found!');
    console.log('   Balance:', identity.balance);
    
    // Load the contract
    console.log('\n3. Loading contract definition...');
    const contractDefinition = JSON.parse(
      fs.readFileSync('./contracts/nft3d-contract.json', 'utf8')
    );
    
    // Remove ownerId from the definition as it will be set by the SDK
    delete contractDefinition.ownerId;
    
    console.log('   Contract loaded, document types:', Object.keys(contractDefinition.documentSchemas));
    
    // Create the data contract
    console.log('\n4. Creating data contract...');
    const dataContract = await client.platform.contracts.create(contractDefinition, identity);
    
    console.log('   Contract created locally');
    console.log('   Contract ID will be:', dataContract.getId().toString());
    
    // Publish the contract
    console.log('\n5. Publishing contract to network...');
    console.log('   This may take a moment...');
    
    await client.platform.contracts.publish(dataContract, identity);
    
    const contractId = dataContract.getId().toString();
    console.log('\n✅ SUCCESS! Contract published!');
    console.log('   Contract ID:', contractId);
    
    // Save to .env
    let envContent = '';
    if (fs.existsSync('.env')) {
      envContent = fs.readFileSync('.env', 'utf8');
      if (envContent.includes('NEXT_PUBLIC_TESTNET_CONTRACT_ID=')) {
        envContent = envContent.replace(
          /NEXT_PUBLIC_TESTNET_CONTRACT_ID=.*/,
          `NEXT_PUBLIC_TESTNET_CONTRACT_ID=${contractId}`
        );
      } else {
        envContent += `\nNEXT_PUBLIC_TESTNET_CONTRACT_ID=${contractId}`;
      }
    } else {
      envContent = `NEXT_PUBLIC_TESTNET_CONTRACT_ID=${contractId}`;
    }
    
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Updated .env file with contract ID');
    
    // Verify the contract
    console.log('\n6. Verifying contract on network...');
    const retrievedContract = await client.platform.contracts.get(contractId);
    console.log('   Contract verified successfully!');
    
    return contractId;
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error('   Code:', error.code);
    }
    if (error.metadata) {
      console.error('   Metadata:', JSON.stringify(error.metadata, null, 2));
    }
    throw error;
  }
}

// Run it
console.log('=== Dash Platform NFT Contract Registration ===');
console.log('Network: Testnet');
console.log('Identity: 5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk\n');

registerContract()
  .then(contractId => {
    console.log('\n=== Registration Complete ===');
    console.log('Contract is now live on Dash Platform testnet!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n=== Registration Failed ===');
    process.exit(1);
  });