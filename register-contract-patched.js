require('dotenv').config();
const Dash = require('dash');
const fs = require('fs');

async function registerContract() {
  const client = new Dash.Client({
    network: 'testnet',
    wallet: {
      mnemonic: null,
      privateKey: process.env.DASH_PRIVATE_KEY
    }
  });

  try {
    console.log('1. Getting wallet account...');
    const account = await client.getWalletAccount();
    console.log('   Account address:', account.getUnusedAddress().address);
    
    const identityId = process.env.DASH_IDENTITY_ID;
    console.log('\n2. Fetching identity from platform...');
    console.log('   Identity ID:', identityId);
    
    const identity = await client.platform.identities.get(identityId);
    if (!identity) {
      throw new Error('Identity not found on platform');
    }
    
    console.log('   Identity found!');
    console.log('   Balance:', identity.balance);
    
    // Load the contract
    console.log('\n3. Loading contract definition...');
    const contractDefinition = JSON.parse(
      fs.readFileSync('./contracts/nft3d-contract-final.json', 'utf8')
    );
    
    console.log('   Contract loaded, document types:', Object.keys(contractDefinition));
    
    // Create the data contract (skip wallet identity check)
    console.log('\n4. Creating data contract...');
    const dataContract = await client.platform.contracts.create(contractDefinition, identity);
    
    console.log('   Contract created locally');
    console.log('   Contract ID will be:', dataContract.getId().toString());
    
    // Publish the contract - our patches should handle the signing
    console.log('\n5. Publishing contract to network...');
    console.log('   Using patched SDK to sign with env private key...');
    console.log('   This may take 30-60 seconds...');
    
    await client.platform.contracts.publish(dataContract, identity);
    
    const contractId = dataContract.getId().toString();
    console.log('\n✅ SUCCESS! Contract published!');
    console.log('   Contract ID:', contractId);
    
    // Update .env file
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
    
    // Verify the contract
    console.log('\n6. Verifying contract on network...');
    const retrievedContract = await client.platform.contracts.get(contractId);
    console.log('   Contract verified successfully!');
    console.log('   Contract details:', retrievedContract.toJSON());
    
    return contractId;
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error('   Code:', error.code);
    }
    if (error.metadata) {
      console.error('   Metadata:', JSON.stringify(error.metadata, null, 2));
    }
    if (error.stack) {
      console.error('\n   Stack trace:', error.stack);
    }
    throw error;
  }
}

// Run it
console.log('=== Dash Platform NFT Contract Registration (Patched SDK) ===');
console.log('Network: Testnet');
console.log('Identity:', process.env.DASH_IDENTITY_ID);
console.log('Using patched SDK to handle existing identities\n');

registerContract()
  .then(contractId => {
    console.log('\n=== Registration Complete ===');
    console.log('Contract is now live on Dash Platform testnet!');
    console.log('\nNext steps:');
    console.log('1. Your contract ID has been saved to .env');
    console.log('2. Restart your Next.js development server');
    console.log('3. The NFT marketplace will use the registered contract');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n=== Registration Failed ===');
    console.error('Check the error details above');
    process.exit(1);
  });