// This script patches the Dash SDK to allow using existing identities
const fs = require('fs');
const path = require('path');

console.log('Patching Dash SDK to support existing identities...\n');

// Find the contracts.js file in the SDK
const contractsPath = path.join(
  __dirname,
  'node_modules/dash/build/SDK/Client/Platform/methods/contracts.js'
);

if (!fs.existsSync(contractsPath)) {
  console.error('❌ Could not find contracts.js in SDK');
  process.exit(1);
}

// Read the current file
const contractsCode = fs.readFileSync(contractsPath, 'utf8');

// Create a backup
fs.writeFileSync(contractsPath + '.backup', contractsCode);
console.log('✅ Created backup: contracts.js.backup');

// Check if we need to patch the publish method
if (contractsCode.includes('is not associated with wallet')) {
  console.log('📝 Patching contracts.publish method...');
  
  // Replace the identity check
  const patchedCode = contractsCode.replace(
    /throw new Error\(`Identity .* is not associated with wallet.*`\);/g,
    '// Identity check disabled for existing identities\n        // throw new Error(`Identity is not associated with wallet`);'
  );
  
  fs.writeFileSync(contractsPath, patchedCode);
  console.log('✅ Patched contracts.publish to accept existing identities');
} else {
  console.log('ℹ️  contracts.publish already patched or different version');
}

// Also patch the platform.js file if needed
const platformPath = path.join(
  __dirname,
  'node_modules/dash/build/SDK/Client/Platform/Platform.js'
);

if (fs.existsSync(platformPath)) {
  const platformCode = fs.readFileSync(platformPath, 'utf8');
  
  // Look for identity association checks
  if (platformCode.includes('getIdentityIds()') && platformCode.includes('includes(')) {
    console.log('\n📝 Patching Platform identity checks...');
    
    const patchedPlatform = platformCode.replace(
      /if \(!.*getIdentityIds\(\)\.includes\(.*\)\) {/g,
      'if (false) { // Disabled identity wallet check'
    );
    
    fs.writeFileSync(platformPath + '.backup', platformCode);
    fs.writeFileSync(platformPath, patchedPlatform);
    console.log('✅ Patched Platform.js identity checks');
  }
}

console.log('\n✅ SDK patching complete!');
console.log('You can now run: node register-contract-final.js');