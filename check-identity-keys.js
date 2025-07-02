require('dotenv').config();
const Dash = require('dash');

async function checkIdentityKeys() {
  const client = new Dash.Client({
    network: 'testnet',
    wallet: {
      mnemonic: null,
      privateKey: process.env.DASH_PRIVATE_KEY
    }
  });

  try {
    console.log('Fetching identity from platform...');
    const identity = await client.platform.identities.get(process.env.DASH_IDENTITY_ID);
    
    if (!identity) {
      throw new Error('Identity not found');
    }

    console.log('\nIdentity Details:');
    console.log('ID:', identity.getId().toString());
    console.log('Balance:', identity.balance);
    
    console.log('\nPublic Keys:');
    const publicKeys = identity.getPublicKeys();
    
    publicKeys.forEach((key, index) => {
      console.log(`\nKey ${index}:`);
      console.log('  ID:', key.getId());
      console.log('  Type:', key.getType());
      console.log('  Purpose:', key.getPurpose());
      console.log('  Security Level:', key.getSecurityLevel());
      console.log('  Data (hex):', key.getData().toString('hex'));
      // console.log('  Disabled:', key.isDisabled());
    });

    // Check which key should be used for contracts (key with ID 2)
    const contractKey = identity.getPublicKeyById(2);
    if (contractKey) {
      console.log('\n✅ Found contract signing key (ID: 2)');
      console.log('   Data:', contractKey.getData().toString('hex'));
    } else {
      console.log('\n⚠️  No key with ID 2 found, will use key 0');
    }

  } catch (error) {
    console.error('Error:', error.message);
  }
}

console.log('=== Identity Key Check ===');
console.log('Identity:', process.env.DASH_IDENTITY_ID);
console.log('');

checkIdentityKeys();