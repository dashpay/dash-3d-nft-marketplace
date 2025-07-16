require('dotenv').config();
const Dash = require('dash');
const fs = require('fs');

// Custom implementation to handle existing identity
class CustomIdentityHandler {
  constructor(client, identityId, privateKey) {
    this.client = client;
    this.identityId = identityId;
    this.privateKey = privateKey;
  }

  async getIdentity() {
    // Fetch the identity from platform
    const identity = await this.client.platform.identities.get(this.identityId);
    if (!identity) {
      throw new Error(`Identity ${this.identityId} not found on platform`);
    }
    return identity;
  }

  async createAndSignStateTransition(documents) {
    // This would need to manually create and sign the state transition
    // Using the private key we have
    const stateTransition = {
      protocolVersion: 1,
      type: 2, // Data contract create
      signature: null,
      signaturePublicKeyId: 0,
      dataContract: documents,
      entropy: Buffer.from(Math.random().toString(36).substring(2, 15), 'utf8'),
      identityId: this.identityId
    };

    // Sign with our private key
    // This is where we'd implement the actual signing
    return stateTransition;
  }
}

async function registerContractCustom() {
  console.log('Starting custom contract registration...\n');

  const client = new Dash.Client({
    network: 'testnet',
    wallet: {
      mnemonic: null,
      privateKey: process.env.DASH_PRIVATE_KEY
    }
  });

  try {
    // Get our custom identity handler
    const identityHandler = new CustomIdentityHandler(
      client,
      process.env.DASH_IDENTITY_ID,
      process.env.DASH_PRIVATE_KEY
    );

    console.log('1. Fetching identity from platform...');
    const identity = await identityHandler.getIdentity();
    console.log('   Identity found!');
    console.log('   Balance:', identity.balance);

    // Load contract
    console.log('\n2. Loading contract definition...');
    const contractDef = JSON.parse(fs.readFileSync('./contracts/nft3d-contract-final.json', 'utf8'));

    // Let's try a different approach - manually construct the data contract
    console.log('\n3. Creating contract with manual approach...');
    
    // Get the wallet account to have proper signing context
    const account = await client.getWalletAccount();
    console.log('   Wallet address:', account.getUnusedAddress().address);

    // Try to manually add the identity to the wallet's identity list
    console.log('\n4. Attempting to associate identity with wallet...');
    
    // This is a workaround - we'll create the contract and try to publish it
    // by manually handling the state transition
    const contract = await client.platform.contracts.create(contractDef, identity);
    console.log('   Contract created locally');
    console.log('   Contract ID:', contract.getId().toString());

    // Now let's try a different publishing approach
    console.log('\n5. Attempting custom publish...');
    
    // Get the contract's state transition
    const stateTransition = contract.toObject();
    console.log('   State transition created');

    // Try to broadcast directly
    console.log('\n6. Broadcasting to network...');
    
    // This is where we'd need to implement custom broadcasting
    // For now, let's save the contract data for manual registration
    const contractData = {
      contractDefinition: contractDef,
      identityId: process.env.DASH_IDENTITY_ID,
      contractId: contract.getId().toString(),
      stateTransition: stateTransition,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync('./contracts/contract-ready.json', JSON.stringify(contractData, null, 2));
    console.log('\n📄 Contract data saved to: contracts/contract-ready.json');

    // Alternative: Try using the platform's internal methods
    console.log('\n7. Trying alternative publish method...');
    
    // Access internal platform methods
    const platform = client.platform;
    
    // Try to publish using platform internals
    try {
      // Some SDKs have internal methods we can use
      const result = await platform.broadcastStateTransition(contract.toObject());
      console.log('✅ Contract published!', result);
    } catch (err) {
      console.log('❌ Alternative method failed:', err.message);
      
      // Final attempt - use the documents.broadcast method
      console.log('\n8. Final attempt using documents broadcast...');
      try {
        const publishResult = await platform.documents.broadcast(contract.toObject(), identity);
        console.log('✅ Success!', publishResult);
      } catch (finalErr) {
        console.log('❌ Final attempt failed:', finalErr.message);
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    console.log('\n📝 Next steps:');
    console.log('1. The contract has been prepared and saved');
    console.log('2. You can use the Dash Platform Console or CLI to register it');
    console.log('3. Or we can explore modifying the SDK source directly');
  }
}

console.log('=== Custom Contract Registration ===');
console.log('Identity:', process.env.DASH_IDENTITY_ID);
console.log('Network: Testnet\n');

registerContractCustom();