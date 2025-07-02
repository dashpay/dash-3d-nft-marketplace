// Create a more flexible signing patch that allows using any key
const fs = require('fs');
const path = require('path');

console.log('Creating flexible key signing patch...\n');

const targetFile = path.join(
  __dirname,
  'node_modules/dash/build/SDK/Client/Platform/signStateTransition.js'
);

// Create a flexible patch that allows specifying which key to use
const flexiblePatch = `"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signStateTransition = void 0;
/**
 *
 * @param {Platform} platform
 * @param {AbstractStateTransition} stateTransition
 * @param {Identity} identity
 * @param {number} [keyIndex]
 * @return {AbstractStateTransition}
 */
async function signStateTransition(platform, stateTransition, identity, keyIndex = 0) {
    const { client } = platform;
    const account = await client.getWalletAccount();
    
    // PATCHED: Flexible key signing
    let privateKey;
    let actualKeyToUse = keyIndex;
    
    // Check if identity is in wallet
    const identityId = identity.getId().toString();
    const walletIdentities = account.identities.getIdentityIds();
    const isInWallet = walletIdentities.includes(identityId);
    
    if (isInWallet) {
        // Identity is in wallet, use normal flow
        const { privateKey: walletKey } = account.identities.getIdentityHDKeyById(identityId, keyIndex);
        privateKey = walletKey;
    } else {
        // Identity not in wallet, check environment variables
        console.log('[PATCHED] Identity not in wallet, checking for external private key...');
        
        const { PrivateKey } = require('@dashevo/dashcore-lib');
        const crypto = require('crypto');
        
        // Check for specific key override in environment
        const keyOverride = process.env.DASH_SIGNING_KEY_ID;
        if (keyOverride !== undefined) {
            actualKeyToUse = parseInt(keyOverride);
            console.log(\`[PATCHED] Using key override from DASH_SIGNING_KEY_ID: \${actualKeyToUse}\`);
        }
        
        // Check for private key in environment
        const envPrivateKey = process.env.DASH_PRIVATE_KEY;
        if (!envPrivateKey) {
            // Also check for key-specific private keys
            const specificKeyVar = \`DASH_PRIVATE_KEY_\${actualKeyToUse}\`;
            const specificKey = process.env[specificKeyVar];
            
            if (specificKey) {
                console.log(\`[PATCHED] Using private key from \${specificKeyVar}\`);
                privateKey = PrivateKey.fromWIF(specificKey);
            } else {
                throw new Error(\`Identity not in wallet and no private key found in DASH_PRIVATE_KEY or \${specificKeyVar}\`);
            }
        } else {
            privateKey = PrivateKey.fromWIF(envPrivateKey);
            
            // Verify this private key matches the requested public key
            const publicKeyFromPrivate = privateKey.toPublicKey();
            const publicKeyHash = crypto.createHash('sha256')
                .update(publicKeyFromPrivate.toBuffer())
                .digest();
            const hash160 = crypto.createHash('ripemd160')
                .update(publicKeyHash)
                .digest();
            
            // Check all keys on the identity to find which one matches our private key
            const publicKeys = identity.getPublicKeys();
            let matchingKeyId = null;
            
            for (const pubKey of publicKeys) {
                if (pubKey.getData().equals(hash160)) {
                    matchingKeyId = pubKey.getId();
                    break;
                }
            }
            
            if (matchingKeyId !== null && matchingKeyId !== actualKeyToUse) {
                console.log(\`[PATCHED] Private key matches identity key \${matchingKeyId}, but requested key \${actualKeyToUse}\`);
                
                // Allow override if explicitly requested
                if (!process.env.DASH_FORCE_KEY_ID) {
                    console.log(\`[PATCHED] Automatically using matching key \${matchingKeyId} instead\`);
                    actualKeyToUse = matchingKeyId;
                } else {
                    console.log(\`[PATCHED] DASH_FORCE_KEY_ID set, using requested key \${actualKeyToUse} anyway\`);
                }
            }
        }
        
        console.log(\`[PATCHED] Using external private key for identity: \${identityId}\`);
    }
    
    // Sign with the appropriate public key
    const publicKey = identity.getPublicKeyById(actualKeyToUse);
    if (!publicKey) {
        throw new Error(\`Public key with ID \${actualKeyToUse} not found on identity\`);
    }
    
    console.log(\`[PATCHED] Signing state transition with key ID: \${actualKeyToUse}\`);
    await stateTransition.sign(publicKey, privateKey.toBuffer());
    
    return stateTransition;
}
exports.signStateTransition = signStateTransition;
//# sourceMappingURL=signStateTransition.js.map`;

// Write the flexible patch
fs.writeFileSync(targetFile, flexiblePatch);
console.log('✅ Applied flexible key signing patch');

console.log('\nThe SDK now supports:');
console.log('1. DASH_PRIVATE_KEY - Your private key (auto-detects which identity key it matches)');
console.log('2. DASH_SIGNING_KEY_ID - Override to use a specific key ID');
console.log('3. DASH_PRIVATE_KEY_<ID> - Private key for a specific key ID');
console.log('4. DASH_FORCE_KEY_ID - Force using requested key even if private key matches different key');

console.log('\nExample usage:');
console.log('- Auto-detect: Just set DASH_PRIVATE_KEY');
console.log('- Force key 2: Set DASH_SIGNING_KEY_ID=2');
console.log('- Multiple keys: Set DASH_PRIVATE_KEY_1=... and DASH_PRIVATE_KEY_2=...');

console.log('\nThis makes the SDK much more flexible for working with external identities!');