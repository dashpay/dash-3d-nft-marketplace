const crypto = require('crypto');
const bs58check = require('bs58check').default;

// WIF private key
const wifPrivateKey = 'XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf';
const expectedPubKeyHash = '4f5e7e4e053a7d640819afefb0b203252d1d2cc4';

// Decode WIF
const decoded = bs58check.decode(wifPrivateKey);
console.log('WIF decoded length:', decoded.length);
console.log('WIF decoded hex:', decoded.toString('hex'));

// Extract private key (skip version byte, and compression flag if present)
let privateKeyBytes;
if (decoded.length === 34) {
  // Compressed key (33 bytes: 1 version + 32 key + 1 compression)
  privateKeyBytes = decoded.slice(1, 33);
  console.log('Key type: Compressed');
} else {
  // Uncompressed key (33 bytes: 1 version + 32 key)
  privateKeyBytes = decoded.slice(1, 33);
  console.log('Key type: Uncompressed');
}

console.log('Private key hex:', privateKeyBytes.toString('hex'));

// Generate public key using secp256k1
const secp256k1 = require('secp256k1');
const isCompressed = decoded.length === 34;
const publicKey = secp256k1.publicKeyCreate(privateKeyBytes, isCompressed);
console.log('Public key hex:', publicKey.toString('hex'));
console.log('Public key length:', publicKey.length);

// Calculate public key hash (Hash160 = SHA256 then RIPEMD160)
const sha256Hash = crypto.createHash('sha256').update(publicKey).digest();
const pubKeyHash = crypto.createHash('ripemd160').update(sha256Hash).digest();
console.log('\nPublic key hash:', pubKeyHash.toString('hex'));
console.log('Expected hash:  ', expectedPubKeyHash);
console.log('Match:', pubKeyHash.toString('hex') === expectedPubKeyHash ? '✅ YES' : '❌ NO');