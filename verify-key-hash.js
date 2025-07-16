const bs58check = require('bs58check').default;

const privateKey = 'XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf';
const address = 'yXwrvV77GMmJ2DLvSA3k1KYGHuSMcFxQUX';
const expectedHash = '4f5e7e4e053a7d640819afefb0b203252d1d2cc4';

try {
  // Decode the address to get the public key hash
  const decoded = bs58check.decode(address);
  
  // Skip the version byte (first byte) to get the public key hash
  const pubKeyHash = Buffer.from(decoded.slice(1, 21)).toString('hex');
  
  console.log('Private Key:', privateKey);
  console.log('Address:', address);
  console.log('Public Key Hash:', pubKeyHash);
  console.log('Expected Hash:', expectedHash);
  console.log('Match:', pubKeyHash === expectedHash ? '✅ YES' : '❌ NO');
  
} catch (error) {
  console.error('Error:', error.message);
}