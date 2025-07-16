require('dotenv').config();
const Dash = require('dash');

async function testContract() {
  // Create a minimal test contract to understand the expected format
  const testContract = {
    nft3d: {
      type: 'object',
      properties: {
        message: {
          type: 'string'
        }
      },
      additionalProperties: false
    }
  };

  console.log('Test contract structure:');
  console.log(JSON.stringify(testContract, null, 2));

  try {
    const client = new Dash.Client({
      network: 'testnet',
      wallet: {
        mnemonic: null,
        privateKey: process.env.DASH_PRIVATE_KEY
      }
    });

    const account = await client.getWalletAccount();
    const identity = await client.platform.identities.get(process.env.DASH_IDENTITY_ID);

    console.log('\nCreating contract with test structure...');
    const dataContract = await client.platform.contracts.create(testContract, identity);
    
    console.log('Success! Contract created locally');
    console.log('Contract structure:', dataContract.toJSON());

  } catch (error) {
    console.error('Error:', error.message);
    if (error.code) console.error('Code:', error.code);
  }
}

testContract();