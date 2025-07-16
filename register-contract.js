const Dash = require('dash');
const fs = require('fs');
const path = require('path');

async function registerContract() {
  console.log('Starting contract registration...');
  
  try {
    // Initialize client with testnet configuration
    const client = new Dash.Client({
      network: 'testnet',
      wallet: {
        mnemonic: null, // Using private key instead
        privateKey: 'XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf'
      },
      apps: {
        nft3d: {
          contractId: null // Will be set after registration
        }
      }
    });

    console.log('Client initialized, fetching identity...');

    // Get the account and identity
    const account = await client.getWalletAccount();
    console.log('Account loaded');
    
    // Get the identity
    const identityId = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';
    const identity = await client.platform.identities.get(identityId);
    
    if (!identity) {
      throw new Error(`Identity ${identityId} not found on testnet`);
    }

    console.log('Identity found:', identity.toJSON());

    // Load contract definition
    const contractPath = path.join(__dirname, 'contracts', 'nft3d-contract.json');
    const contractDefinition = JSON.parse(fs.readFileSync(contractPath, 'utf8'));
    
    console.log('Contract definition loaded');
    console.log('Creating contract on testnet...');

    // Create and broadcast the contract
    const contract = await client.platform.contracts.create(contractDefinition, identity);
    
    console.log('Broadcasting contract...');
    const result = await client.platform.contracts.publish(contract, identity);
    
    const contractId = contract.toJSON().id;
    console.log('\n✅ Contract registered successfully!');
    console.log('Contract ID:', contractId);
    
    // Create or update .env file
    const envPath = path.join(__dirname, '.env');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      // Replace existing contract ID if present
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
    
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ Updated .env file with contract ID');
    
    // Verify the contract
    console.log('\nVerifying contract...');
    const registeredContract = await client.platform.contracts.get(contractId);
    console.log('Contract verified:', registeredContract.toJSON());
    
    return contractId;
  } catch (error) {
    console.error('\n❌ Error registering contract:', error.message);
    if (error.metadata) {
      console.error('Metadata:', error.metadata);
    }
    throw error;
  } finally {
    // Client disconnect handled automatically
  }
}

// Run the registration
console.log('=== Dash 3D NFT Contract Registration ===\n');
console.log('Network: Testnet');
console.log('Identity: 5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk');
console.log('Contract: contracts/nft3d-contract.json\n');

registerContract()
  .then(contractId => {
    console.log('\n=== Registration Complete ===');
    console.log('Next steps:');
    console.log('1. Contract ID saved to .env file');
    console.log('2. Restart your Next.js development server');
    console.log('3. The NFT marketplace will use the new contract');
  })
  .catch(error => {
    console.error('\n=== Registration Failed ===');
    console.error('Please check:');
    console.error('1. Your identity has sufficient credits');
    console.error('2. You are connected to testnet');
    console.error('3. The contract JSON is valid');
    process.exit(1);
  });