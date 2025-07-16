// Patch signStateTransition to use our private key
const fs = require('fs');
const path = require('path');

console.log('Patching signStateTransition...\n');

const targetFile = path.join(
  __dirname,
  'node_modules/dash/build/SDK/Client/Platform/signStateTransition.js'
);

if (!fs.existsSync(targetFile)) {
  console.error('❌ Could not find signStateTransition.js');
  process.exit(1);
}

// Read the file
const originalCode = fs.readFileSync(targetFile, 'utf8');

// Create backup
fs.writeFileSync(targetFile + '.backup', originalCode);
console.log('✅ Created backup: signStateTransition.js.backup');

// Patch the function to use our private key from env
const patchedCode = originalCode.replace(
  'const { privateKey } = account.identities.getIdentityHDKeyById(identity.getId().toString(), keyIndex);',
  `// PATCHED: Use private key from environment for existing identities
    let privateKey;
    try {
        const hdKey = account.identities.getIdentityHDKeyById(identity.getId().toString(), keyIndex);
        privateKey = hdKey ? hdKey.privateKey : null;
    } catch (err) {
        // Identity not in wallet, use env private key
        console.log('Using private key from environment for identity:', identity.getId().toString());
        const { PrivateKey } = require('@dashevo/dashcore-lib');
        const envPrivateKey = process.env.DASH_PRIVATE_KEY;
        if (envPrivateKey) {
            privateKey = PrivateKey.fromWIF(envPrivateKey);
        } else {
            throw new Error('Identity not in wallet and no DASH_PRIVATE_KEY in environment');
        }
    }
    if (!privateKey) {
        throw new Error('Could not get private key for signing');
    }`
);

fs.writeFileSync(targetFile, patchedCode);
console.log('✅ Patched signStateTransition.js');

console.log('\n✅ All patches applied!');
console.log('\nNow run: node register-contract-final.js');