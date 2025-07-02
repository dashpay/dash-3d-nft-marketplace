const Dash = require('dash');
const fs = require('fs');

(async () => {
  try {
    console.log('Initializing Dash client...');
    
    const clientOpts = {
      network: 'testnet',
      wallet: {
        mnemonic: null,
        privateKey: 'XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf'
      }
    };

    const client = new Dash.Client(clientOpts);
    
    console.log('Loading contract definition...');
    const contractJSON = fs.readFileSync('./contracts/nft3d-contract.json', 'utf8');
    const contractDefinition = JSON.parse(contractJSON);
    
    console.log('Getting wallet account...');
    const account = await client.getWalletAccount();
    
    console.log('Account address:', account.getUnusedAddress().address);
    console.log('Account balance:', account.getConfirmedBalance());
    
    // Check if we need to register an identity or use existing one
    const identityId = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';
    
    console.log('Fetching identity:', identityId);
    const identities = account.identities.getIdentityIds();
    console.log('Account identities:', identities);
    
    let identity;
    if (!identities.includes(identityId)) {
      console.log('Identity not in wallet, fetching from platform...');
      identity = await client.platform.identities.get(identityId);
    } else {
      console.log('Using identity from wallet');
      identity = await account.identities.get(identityId);
    }
    
    console.log('Identity found:', identity ? 'Yes' : 'No');
    
    if (!identity) {
      throw new Error('Identity not found');
    }
    
    console.log('Creating data contract...');
    const contract = await client.platform.contracts.create(contractDefinition, identity);
    
    console.log('Publishing contract...');
    await client.platform.contracts.publish(contract, identity);
    
    const contractId = contract.toJSON().$id;
    console.log('\n✅ Success! Contract ID:', contractId);
    
    // Update .env
    let envContent = '';
    if (fs.existsSync('.env')) {
      envContent = fs.readFileSync('.env', 'utf8');
      if (envContent.includes('NEXT_PUBLIC_TESTNET_CONTRACT_ID=')) {
        envContent = envContent.replace(/NEXT_PUBLIC_TESTNET_CONTRACT_ID=.*/, `NEXT_PUBLIC_TESTNET_CONTRACT_ID=${contractId}`);
      } else {
        envContent += `\nNEXT_PUBLIC_TESTNET_CONTRACT_ID=${contractId}`;
      }
    } else {
      envContent = `NEXT_PUBLIC_TESTNET_CONTRACT_ID=${contractId}`;
    }
    
    fs.writeFileSync('.env', envContent);
    console.log('✅ Updated .env file');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error('\nStack trace:', error.stack);
    }
    process.exit(1);
  }
})();