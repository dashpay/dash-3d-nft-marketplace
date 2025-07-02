// Test to explore what's actually in the WASM module
describe('WASM Module Exploration', () => {
  it('should show what functions are available in WASM module', async () => {
    const DashModule = await import('@/wasm/wasm_sdk');
    
    console.log('WASM Module type:', typeof DashModule);
    console.log('WASM Module keys:', Object.keys(DashModule).sort());
    
    // Check for specific functions
    console.log('\nFunction availability:');
    console.log('fetchIdentityBalance:', typeof DashModule.fetchIdentityBalance);
    console.log('fetchIdentity:', typeof DashModule.fetchIdentity);
    console.log('fetch_identity_balance:', typeof DashModule.fetch_identity_balance);
    console.log('fetch_identity:', typeof DashModule.fetch_identity);
    
    // Check WasmSdkBuilder
    if (DashModule.WasmSdkBuilder) {
      console.log('\nWasmSdkBuilder methods:', Object.getOwnPropertyNames(DashModule.WasmSdkBuilder));
      const proto = Object.getPrototypeOf(DashModule.WasmSdkBuilder);
      console.log('WasmSdkBuilder prototype:', Object.getOwnPropertyNames(proto));
    }
    
    // Look for any fetch-related functions
    console.log('\nAll functions containing "fetch":');
    Object.keys(DashModule).forEach(key => {
      if (key.toLowerCase().includes('fetch') && typeof DashModule[key] === 'function') {
        console.log(`  ${key}: ${typeof DashModule[key]}`);
      }
    });
    
    // Look for identity-related functions
    console.log('\nAll functions containing "identity":');
    Object.keys(DashModule).forEach(key => {
      if (key.toLowerCase().includes('identity') && typeof DashModule[key] === 'function') {
        console.log(`  ${key}: ${typeof DashModule[key]}`);
      }
    });
    
    expect(DashModule).toBeDefined();
  });
});