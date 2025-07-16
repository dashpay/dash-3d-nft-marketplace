require('dotenv').config();
const Dash = require('dash');
const fs = require('fs');

async function registerContract() {
  // Check for required environment variables
  if (!process.env.DASH_IDENTITY_ID || !process.env.DASH_PRIVATE_KEY) {
    console.error('❌ Missing required environment variables!');
    console.error('Please ensure your .env file contains:');
    console.error('- DASH_IDENTITY_ID');
    console.error('- DASH_PRIVATE_KEY');
    process.exit(1);
  }

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
    // Load contract directly as documentSchemas
    const contractDefinition = JSON.parse(
      fs.readFileSync('./contracts/nft3d-contract-final.json', 'utf8')
    );
    
    // Remove ownerId from the definition as it will be set by the SDK
    delete contractDefinition.ownerId;
    
    console.log('   Contract loaded, document types:', Object.keys(contractDefinition));
    
    // Debug: Let's check the exact structure
    console.log('\n   Checking document schema structure...');
    const nft3dSchema = contractDefinition.nft3d;
    console.log('   - Schema type:', nft3dSchema.type);
    console.log('   - Has properties:', !!nft3dSchema.properties);
    console.log('   - Property count:', Object.keys(nft3dSchema.properties).length);
    
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
console.log('Using credentials from .env file\n');

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