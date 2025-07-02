// Debug utilities for WASM SDK - avoiding circular imports

// Function to safely inspect object properties
function inspectObject(obj: any, name: string, depth: number = 0, seen: WeakSet<any> = new WeakSet()): any {
  if (depth > 3) return 'Max depth reached';
  if (!obj) return obj;
  
  const type = typeof obj;
  if (type !== 'object') return `${type}: ${obj}`;
  
  // Prevent circular references
  if (seen.has(obj)) return '[Circular Reference]';
  seen.add(obj);
  
  try {
    const result: any = {
      type: obj.constructor?.name || 'Object',
      properties: []
    };
    
    // Safely get property names
    try {
      const props = Object.getOwnPropertyNames(obj);
      result.properties = props.slice(0, 20);
    } catch (e) {
      result.properties = ['Error getting properties'];
    }
    
    // Get prototype methods
    try {
      const proto = Object.getPrototypeOf(obj);
      if (proto && proto !== Object.prototype) {
        const protoProps = Object.getOwnPropertyNames(proto);
        result.prototypeMethods = protoProps.slice(0, 20);
      }
    } catch (e) {
      result.prototypeMethods = ['Error getting prototype'];
    }
    
    return result;
  } catch (e) {
    return `Error inspecting: ${e}`;
  }
}

// Function to debug SDK configuration
export async function debugSDKConfiguration(wasmModule?: any) {
  console.log('=== Debugging SDK Configuration ===');
  
  try {
    // Use provided WASM module or try to load it
    let wasm = wasmModule;
    if (!wasm) {
      console.log('No WASM module provided, attempting dynamic import...');
      const DashModule = await import('@/wasm/wasm_sdk');
      wasm = DashModule;
      console.log('WASM SDK loaded via dynamic import');
    }
    
    if (!wasm.WasmSdkBuilder) {
      console.log('WasmSdkBuilder not found in module');
      console.log('Available exports:', Object.keys(wasm).slice(0, 20));
      return;
    }
    
    // Create builder
    const builder = wasm.WasmSdkBuilder.new_testnet();
    console.log('Builder created');
    
    // Inspect builder methods
    const builderMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(builder));
    console.log('Builder methods:', builderMethods);
    
    // Build SDK
    const sdk = builder.build();
    console.log('SDK built');
    
    // Inspect SDK structure
    const sdkInfo = inspectObject(sdk, 'sdk');
    console.log('SDK structure:', sdkInfo);
    
    // Try to find what the SDK is connecting to
    console.log('Available WASM functions:', Object.keys(wasm).filter(k => typeof wasm[k] === 'function').slice(0, 30));
    
  } catch (error) {
    console.error('Error debugging SDK:', error);
  }
}

// Function to test different evonode configurations
export async function testEvonodeConnections(wasmModule?: any, sdkInstance?: any) {
  console.log('\n=== Testing Evonode Connections ===');
  
  try {
    let wasm = wasmModule;
    let sdk = sdkInstance;
    
    if (!wasm || !sdk) {
      console.log('Loading WASM SDK for connection test...');
      const DashModule = await import('@/wasm/wasm_sdk');
      wasm = DashModule;
      
      if (!sdk && wasm.WasmSdkBuilder) {
        const builder = wasm.WasmSdkBuilder.new_testnet();
        sdk = builder.build();
      }
    }
    
    console.log('Testing with default testnet configuration...');
    
    // Try to fetch identity balance
    if (typeof wasm.fetchIdentityBalance === 'function') {
      console.log('Testing fetchIdentityBalance...');
      
      let fetchOptions = null;
      if (wasm.FetchOptions) {
        fetchOptions = new wasm.FetchOptions();
        if (typeof fetchOptions.withProve === 'function') {
          fetchOptions.withProve(true);
        }
      }
      
      try {
        const balance = await wasm.fetchIdentityBalance(
          sdk, 
          '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk',
          fetchOptions
        );
        console.log('✓ Successfully fetched balance:', balance);
      } catch (error: any) {
        console.log('✗ Failed to fetch balance:', error.message);
        console.log('Full error:', error);
      } finally {
        if (fetchOptions && typeof fetchOptions.free === 'function') {
          try {
            fetchOptions.free();
          } catch (e) {
            // Ignore cleanup errors
          }
        }
      }
    }
    
    // Try to get current evonodes if available
    if (typeof wasm.getCurrentEvonodes === 'function') {
      console.log('\nTrying to get current evonodes...');
      try {
        const evonodes = await wasm.getCurrentEvonodes(sdk);
        console.log('Current evonodes:', evonodes);
      } catch (error: any) {
        console.log('Failed to get evonodes:', error.message);
      }
    }
    
  } catch (error) {
    console.error('Error testing connections:', error);
  }
}

// Function to extract connection info by forcing errors
export async function extractConnectionInfo(wasmModule?: any, sdkInstance?: any) {
  console.log('\n=== Extracting Connection Info ===');
  
  try {
    let wasm = wasmModule;
    let sdk = sdkInstance;
    
    if (!wasm || !sdk) {
      console.log('Loading WASM SDK for info extraction...');
      const DashModule = await import('@/wasm/wasm_sdk');
      wasm = DashModule;
      
      if (!sdk && wasm.WasmSdkBuilder) {
        const builder = wasm.WasmSdkBuilder.new_testnet();
        sdk = builder.build();
      }
    }
    
    // Try various invalid operations to see error messages
    console.log('Attempting operations to extract connection details...');
    
    // Try with invalid identity ID to see error
    if (typeof wasm.fetchIdentity === 'function') {
      try {
        await wasm.fetchIdentity(sdk, 'invalid-id');
      } catch (error: any) {
        console.log('fetchIdentity error:', error.message);
        if (error.toString().includes('://')) {
          console.log('Found URL in error:', error.toString());
        }
      }
    }
    
    // Try to fetch with no options
    if (typeof wasm.fetchIdentityBalance === 'function') {
      try {
        await wasm.fetchIdentityBalance(sdk, '11111111111111111111111111111111111111111111');
      } catch (error: any) {
        console.log('fetchIdentityBalance error:', error.message);
        console.log('Error details:', error);
      }
    }
    
  } catch (error) {
    console.error('Error extracting info:', error);
  }
}

// Run all debug tests
export async function runAllDebugTests(logger?: (msg: string) => void, wasmModule?: any, sdkInstance?: any) {
  const log = (msg: string) => {
    console.log(msg);
    if (logger) logger(msg);
  };
  
  log('Starting comprehensive WASM SDK debug tests...\n');
  
  // Redirect console.log temporarily
  const originalLog = console.log;
  if (logger) {
    console.log = (...args) => {
      const msg = args.map(arg => {
        if (typeof arg === 'object') {
          try {
            // Try to stringify with circular reference handling
            const seen = new WeakSet();
            return JSON.stringify(arg, (key, value) => {
              if (typeof value === 'object' && value !== null) {
                if (seen.has(value)) {
                  return '[Circular Reference]';
                }
                seen.add(value);
              }
              return value;
            }, 2);
          } catch (e) {
            return String(arg);
          }
        }
        return String(arg);
      }).join(' ');
      originalLog(...args);
      logger(msg);
    };
  }
  
  try {
    await debugSDKConfiguration(wasmModule);
    await testEvonodeConnections(wasmModule, sdkInstance);
    await extractConnectionInfo(wasmModule, sdkInstance);
  } finally {
    // Restore console.log
    console.log = originalLog;
  }
  
  log('\n=== Debug tests complete ===');
}