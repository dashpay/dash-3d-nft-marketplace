const Dash = require('dash');
const crypto = require('crypto');

const privateKey = 'XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf';
const expectedHash = '4f5e7e4e053a7d640819afefb0b203252d1d2cc4';

try {
  // Create a client with the private key
  const client = new Dash.Client({
    network: 'testnet',
    wallet: {
      mnemonic: null,
      privateKey: privateKey
    }
  });

  // Get the account
  client.getWalletAccount().then(account => {
    const address = account.getUnusedAddress();
    
    console.log('Private Key:', privateKey);
    console.log('Address:', address.address);
    console.log('Address Type:', address.type);
    
    // Get the public key hash from the address
    const addressObj = account.getAddress(0);
    console.log('\nAddress Object:', addressObj);
    
    // Try to get the public key hash
    if (addressObj && addressObj.publicKeyHash) {
      const pubKeyHash = addressObj.publicKeyHash.toString('hex');
      console.log('\nPublic Key Hash:', pubKeyHash);
      console.log('Expected Hash:', expectedHash);
      console.log('Match:', pubKeyHash === expectedHash);
    }
    
    // Alternative method - decode the address
    const { decode } = require('bs58check');
    try {
      const decoded = decode(address.address);
      const pubKeyHashFromAddress = decoded.slice(1, 21).toString('hex');
      console.log('\nPublic Key Hash (from address):', pubKeyHashFromAddress);
      console.log('Expected Hash:', expectedHash);
      console.log('Match:', pubKeyHashFromAddress === expectedHash);
    } catch (e) {
      console.log('\nCould not decode address:', e.message);
    }
    
  }).catch(err => {
    console.error('Error:', err);
  });

} catch (error) {
  console.error('Error setting up client:', error);
}