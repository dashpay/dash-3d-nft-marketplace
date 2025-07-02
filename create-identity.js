require('dotenv').config();
const Dash = require('dash');

async function createIdentity() {
  if (!process.env.DASH_PRIVATE_KEY) {
    console.error('❌ Missing DASH_PRIVATE_KEY in .env file!');
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
    const address = account.getUnusedAddress().address;
    console.log('   Account address:', address);
    console.log('   Account balance:', account.getTotalBalance());
    
    if (account.getTotalBalance() === 0) {
      console.log('\n❌ Account has no balance!');
      console.log('   Please fund this address with testnet DASH:', address);
      console.log('   You can get testnet DASH from: https://testnet-faucet.dash.org/');
      return;
    }
    
    console.log('\n2. Creating new identity...');
    const identity = await client.platform.identities.register();
    
    const identityId = identity.getId().toString();
    console.log('\n✅ Identity created successfully!');
    console.log('   Identity ID:', identityId);
    
    // Update .env file
    const fs = require('fs');
    let envContent = fs.readFileSync('.env', 'utf8');
    
    if (envContent.includes('DASH_IDENTITY_ID=')) {
      envContent = envContent.replace(
        /DASH_IDENTITY_ID=.*/,
        `DASH_IDENTITY_ID=${identityId}`
      );
    } else {
      envContent += `\nDASH_IDENTITY_ID=${identityId}`;
    }
    
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ Updated .env file with new identity ID');
    
    console.log('\nNext steps:');
    console.log('1. Run: node register-contract-final.js');
    console.log('2. The contract will be registered with this new identity');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error('   Code:', error.code);
    }
  }
}

console.log('=== Dash Platform Identity Creation ===');
console.log('Network: Testnet\n');

createIdentity();