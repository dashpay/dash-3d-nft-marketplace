require('dotenv').config();
const Dash = require('dash');
const fs = require('fs');

async function registerContract() {
  console.log('Setting up Dash client...');
  
  const clientOpts = {
    network: 'testnet',
    wallet: {
      mnemonic: null,
      privateKey: process.env.DASH_PRIVATE_KEY
    }
  };

  const client = new Dash.Client(clientOpts);

  try {
    console.log('\n1. Checking wallet...');
    const account = await client.getWalletAccount();
    const address = account.getUnusedAddress().address;
    console.log('   Wallet address:', address);
    console.log('   Balance:', account.getTotalBalance());
    
    // Load contract
    console.log('\n2. Loading contract...');
    const contractDef = JSON.parse(fs.readFileSync('./contracts/nft3d-contract-final.json', 'utf8'));
    console.log('   Contract loaded successfully');
    
    // Get identity from platform
    console.log('\n3. Fetching identity from platform...');
    const identityId = process.env.DASH_IDENTITY_ID;
    const identity = await client.platform.identities.get(identityId);
    
    if (!identity) {
      throw new Error(`Identity ${identityId} not found`);
    }
    
    console.log('   Identity found!');
    console.log('   ID:', identity.getId().toString());
    console.log('   Balance:', identity.getBalance());
    
    // Create contract
    console.log('\n4. Creating contract...');
    console.log('   This creates the contract locally first...');
    
    const contract = await client.platform.contracts.create(contractDef, identity);
    const contractId = contract.getId().toString();
    
    console.log('   Contract created!');
    console.log('   Contract ID:', contractId);
    
    console.log('\n5. Publishing contract...');
    console.log('   This broadcasts the contract to the network...');
    console.log('   ⏳ Please wait, this may take 30-60 seconds...');
    
    try {
      await client.platform.contracts.publish(contract, identity);
      console.log('\n✅ Contract published successfully!');
    } catch (publishError) {
      if (publishError.message.includes('not associated')) {
        console.log('\n❌ Cannot publish: Identity not in wallet');
        console.log('\nThe issue is that while we have the correct private key,');
        console.log('the SDK requires the identity to be properly imported into the wallet.');
        console.log('\nAlternative solutions:');
        console.log('1. Use dash-cli or Dash Platform Console to register the contract');
        console.log('2. Import the identity into a new wallet using this private key');
        console.log('3. Use the REST API directly to register the contract');
        
        // Save contract for manual registration
        const contractForRegistration = {
          contractDefinition: contractDef,
          identity: {
            id: identityId,
            publicKeyHash: '4f5e7e4e053a7d640819afefb0b203252d1d2cc4'
          },
          contractId: contractId,
          createdAt: new Date().toISOString()
        };
        
        fs.writeFileSync(
          './contracts/contract-for-registration.json',
          JSON.stringify(contractForRegistration, null, 2)
        );
        
        console.log('\n📄 Contract details saved to: contracts/contract-for-registration.json');
        console.log('   You can use this file for manual registration.');
      } else {
        throw publishError;
      }
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.metadata) console.error('Metadata:', error.metadata);
  }
}

console.log('=== Dash Platform Contract Registration ===');
console.log('Identity:', process.env.DASH_IDENTITY_ID);
console.log('Network: Testnet\n');

registerContract();