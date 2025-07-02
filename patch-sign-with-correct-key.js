// Fix the signing to use the correct key
const fs = require('fs');
const path = require('path');

console.log('Updating signStateTransition patch for correct key usage...\n');

const targetFile = path.join(
  __dirname,
  'node_modules/dash/build/SDK/Client/Platform/signStateTransition.js'
);

// Read current file
const currentCode = fs.readFileSync(targetFile, 'utf8');

// Create new patch that properly handles key selection
const improvedPatch = `"use strict";
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
    
    // PATCHED: Enhanced to handle existing identities with proper key management
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
        // Identity not in wallet, use env private key
        console.log('[PATCHED] Using private key from environment for identity:', identityId);
        const { PrivateKey } = require('@dashevo/dashcore-lib');
        const envPrivateKey = process.env.DASH_PRIVATE_KEY;
        
        if (!envPrivateKey) {
            throw new Error('Identity not in wallet and no DASH_PRIVATE_KEY in environment');
        }
        
        privateKey = PrivateKey.fromWIF(envPrivateKey);
        
        // IMPORTANT: Our private key corresponds to key ID 1, not the requested key
        // The identity has multiple keys:
        // - Key 0: Different key
        // - Key 1: Our key (4f5e7e4e053a7d640819afefb0b203252d1d2cc4)
        // - Key 2: Contract signing key (but we don't have its private key)
        
        // If they're asking for key 2 (contracts), we need to use key 1 instead
        // since that's the key we have the private key for
        if (keyIndex === 2) {
            console.log('[PATCHED] Requested key 2 for contracts, but using key 1 (our key)');
            actualKeyToUse = 1;
        }
    }
    
    // Sign with the appropriate public key
    const publicKey = identity.getPublicKeyById(actualKeyToUse);
    if (!publicKey) {
        throw new Error(\`Public key with ID \${actualKeyToUse} not found on identity\`);
    }
    
    console.log(\`[PATCHED] Signing with key ID: \${actualKeyToUse}\`);
    await stateTransition.sign(publicKey, privateKey.toBuffer());
    
    return stateTransition;
}
exports.signStateTransition = signStateTransition;
//# sourceMappingURL=signStateTransition.js.map`;

// Write the improved patch
fs.writeFileSync(targetFile, improvedPatch);
console.log('✅ Updated signStateTransition.js with improved key handling');

console.log('\nThe patch now:');
console.log('- Properly detects if identity is in wallet');
console.log('- Uses key 1 (our key) when key 2 is requested for contracts');
console.log('- Handles the mismatch between requested key and available key');

console.log('\nRun: node register-contract-patched.js');