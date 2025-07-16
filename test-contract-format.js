const fs = require('fs');

// Load and inspect the contract
const contractJSON = fs.readFileSync('./contracts/nft3d-contract.json', 'utf8');
const contract = JSON.parse(contractJSON);

console.log('Contract structure:');
console.log(JSON.stringify(contract, null, 2));

console.log('\nDocument schema type:', typeof contract.documentSchemas.nft3d);
console.log('Is object?', contract.documentSchemas.nft3d && typeof contract.documentSchemas.nft3d === 'object');

// Check if all required fields are present
console.log('\nChecking schema structure:');
console.log('- Has type?', 'type' in contract.documentSchemas.nft3d);
console.log('- Has properties?', 'properties' in contract.documentSchemas.nft3d);
console.log('- Has required?', 'required' in contract.documentSchemas.nft3d);