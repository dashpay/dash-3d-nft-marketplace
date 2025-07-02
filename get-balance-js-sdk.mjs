#\!/usr/bin/env node
import Dash from './src/dash-sdk-src/Dash.js';

const IDENTITY_ID = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';

async function getBalance() {
  console.log(`Getting balance for identity: ${IDENTITY_ID}\n`);
  
  try {
    const client = new Dash.Client({
      network: 'testnet',
      apps: {
        nft3d: {
          contractId: 'GWRSAVFMjXx8HpQFaNJMqBV7MBgMK4br5UESsB4S31Ec',
        },
      },
    });
    
    console.log('Fetching identity balance...');
    
    // Get identity balance directly
    const identity = await client.platform.identities.get(IDENTITY_ID);
    
    if (identity && identity.balance \!== undefined) {
      const balanceNum = Number(identity.balance);
      console.log('\n' + '='.repeat(50));
      console.log('✅ SUCCESS\!\n');
      console.log(`Identity: ${IDENTITY_ID}`);
      console.log(`Balance: ${balanceNum} duffs`);
      console.log(`Balance: ${balanceNum / 100000000} DASH`);
      console.log('='.repeat(50));
    } else {
      console.log('Identity not found or balance unavailable');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getBalance().catch(console.error);
EOF < /dev/null