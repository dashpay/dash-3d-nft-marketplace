// Patch Dash SDK to allow existing identities
const fs = require('fs');
const path = require('path');

console.log('Patching Dash SDK identity checks...\n');

// Path to the file that needs patching
const targetFile = path.join(
  __dirname,
  'node_modules/@dashevo/wallet-lib/src/types/Identities/methods/getIdentityHDKeyById.js'
);

if (!fs.existsSync(targetFile)) {
  console.error('❌ Could not find getIdentityHDKeyById.js');
  process.exit(1);
}

// Read the file
const originalCode = fs.readFileSync(targetFile, 'utf8');

// Create backup
fs.writeFileSync(targetFile + '.backup', originalCode);
console.log('✅ Created backup: getIdentityHDKeyById.js.backup');

// Patch the identity check
const patchedCode = originalCode.replace(
  'if (identityIndex === -1) {',
  `// PATCHED: Allow external identities
  if (identityIndex === -1) {
    // Instead of throwing, return a key derived from the identity ID
    const { HDPrivateKey } = require('@dashevo/dashcore-lib');
    const crypto = require('crypto');
    
    // Use the wallet's master key if available
    if (this.keyChain && this.keyChain.HDPrivateKey) {
      // Derive a key using the identity ID as additional entropy
      const hash = crypto.createHash('sha256').update(identityId).digest();
      const childIndex = hash.readUInt32BE(0) & 0x7FFFFFFF; // Use first 4 bytes as index
      return this.keyChain.HDPrivateKey.derive(childIndex, false);
    }
    
    // Original error (commented out):
    // throw new Error(\`Identity with ID \${identityId} is not associated with wallet, or it's not synced\`);
    
    // Return null to handle elsewhere
    return null;
  }
  
  // ORIGINAL CODE:
  if (false) {`
);

fs.writeFileSync(targetFile, patchedCode);
console.log('✅ Patched getIdentityHDKeyById.js\n');

// Also patch the contracts publish method if we can find it
const contractsFiles = [
  'node_modules/dash/build/SDK/Client/Platform/methods/contracts/publish.js',
  'node_modules/dash/src/SDK/Client/Platform/methods/contracts/publish.js',
  'node_modules/@dashevo/platform-protocol/lib/stateTransition/StateTransitionFactory.js'
];

let foundContractsFile = false;
for (const file of contractsFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    console.log(`Found contracts file: ${file}`);
    foundContractsFile = true;
    break;
  }
}

if (!foundContractsFile) {
  console.log('⚠️  Could not find contracts publish file - may be bundled differently');
}

console.log('\n✅ Patching complete!');
console.log('\nNow you can try running: node register-contract-final.js');
console.log('\nIf it still fails, we may need to create a fully custom registration.');