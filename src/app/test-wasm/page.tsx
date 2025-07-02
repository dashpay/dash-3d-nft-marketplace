'use client';

import { useState, useEffect } from 'react';
import { runAllDebugTests } from '@/lib/debug-wasm-internals';

export default function TestWasmPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [client, setClient] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  useEffect(() => {
    // Initialize WASM SDK
    const initWasm = async () => {
      try {
        addLog('Starting WASM initialization...');
        const DashModule = await import('@/wasm/wasm_sdk');
        addLog('DashModule imported successfully');
        
        // Check what's in the module
        addLog('Module exports: ' + Object.keys(DashModule).slice(0, 10).join(', '));
        
        // The module might auto-initialize or use a different init method
        if (typeof DashModule.default === 'function') {
          await DashModule.default();
          addLog('WASM module initialized via default()');
        } else if (typeof DashModule.initSync === 'function') {
          DashModule.initSync();
          addLog('WASM module initialized via initSync()');
        } else {
          addLog('No initialization function found, module might be auto-initialized');
        }
        
        // Create SDK using our wrapper
        if (DashModule.WasmSdkBuilder) {
          const builder = DashModule.WasmSdkBuilder.new_testnet();
          addLog('SDK Builder created');
          
          const sdk = builder.build();
          addLog('SDK built successfully');
          addLog('SDK methods: ' + Object.getOwnPropertyNames(Object.getPrototypeOf(sdk || {})).slice(0, 10).join(', '));
          
          setClient({ sdk, wasm: DashModule });
        } else {
          addLog('WasmSdkBuilder not found in module');
        }
        
      } catch (error) {
        addLog(`Error initializing WASM: ${error}`);
        console.error('Full error:', error);
      }
    };
    
    initWasm();
  }, []);

  const testDirectConnection = async () => {
    addLog('Testing direct connection to testnet nodes...');
    
    const testUrls = [
      'https://1.testnet.networks.dash.org:1443',
      'https://platform.testnet.networks.dash.org:443',
      'https://54.184.61.85:1443',
      'https://35.166.180.159:1443',
      'https://35.160.105.153:1443'
    ];
    
    for (const url of testUrls) {
      try {
        addLog(`Testing fetch to ${url}...`);
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Accept': 'application/json'
          }
        });
        addLog(`${url} - Status: ${response.status}`);
      } catch (error) {
        addLog(`${url} - Error: ${error}`);
      }
    }
  };

  const testGetIdentity = async () => {
    if (!client) {
      addLog('Client not initialized!');
      return;
    }
    
    setIsLoading(true);
    const identityId = '5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk';
    
    try {
      addLog(`Fetching identity: ${identityId}`);
      
      const { sdk, wasm } = client;
      
      if (typeof wasm.fetchIdentityBalance === 'function') {
        addLog('Using fetchIdentityBalance function');
        
        // Create FetchOptions if available
        let fetchOptions = null;
        if (wasm.FetchOptions) {
          fetchOptions = new wasm.FetchOptions();
          if (typeof fetchOptions.withProve === 'function') {
            fetchOptions.withProve(true);
            addLog('FetchOptions created with prove=true');
          }
        }
        
        try {
          const balance = await wasm.fetchIdentityBalance(sdk, identityId, fetchOptions);
          addLog(`Balance fetched successfully: ${balance}`);
        } catch (fetchError) {
          addLog(`Balance fetch error: ${fetchError.message}`);
          throw fetchError;
        } finally {
          // Clean up
          if (fetchOptions && typeof fetchOptions.free === 'function') {
            fetchOptions.free();
          }
        }
      } else {
        addLog('fetchIdentityBalance function not found');
        addLog('Available functions: ' + Object.keys(wasm).filter(k => typeof wasm[k] === 'function' && k.includes('fetch')).join(', '));
      }
    } catch (error) {
      addLog(`Error fetching identity: ${error}`);
      console.error('Full error object:', error);
      
      // Try to get more error details
      if (error && typeof error === 'object') {
        addLog(`Error type: ${error.constructor.name}`);
        addLog(`Error message: ${error.message || 'No message'}`);
        addLog(`Error stack: ${error.stack || 'No stack'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const testGetDocuments = async () => {
    if (!client) {
      addLog('Client not initialized!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      addLog('Testing document fetch...');
      const { sdk, wasm } = client;
      
      const contractId = 'EBioSoFFTDf346ndCMHGmYF8QzgwM8972jG5fL4ndBL7';
      
      if (typeof wasm.fetch_documents === 'function') {
        addLog('Using fetch_documents function');
        
        const documents = await wasm.fetch_documents(sdk, contractId, 'nft3d', null);
        addLog(`Documents result: ${documents}`);
      } else if (typeof wasm.fetchDocument === 'function') {
        addLog('Using fetchDocument function');
        
        // Try to fetch contract first
        if (typeof wasm.fetchDataContract === 'function') {
          let fetchOptions = null;
          if (wasm.FetchOptions) {
            fetchOptions = new wasm.FetchOptions();
            if (typeof fetchOptions.withProve === 'function') {
              fetchOptions.withProve(true);
            }
          }
          
          try {
            const contract = await wasm.fetchDataContract(sdk, contractId, fetchOptions);
            addLog(`Contract fetched: ${contract}`);
          } catch (e) {
            addLog(`Contract fetch error: ${e.message}`);
          } finally {
            if (fetchOptions && typeof fetchOptions.free === 'function') {
              fetchOptions.free();
            }
          }
        }
      } else {
        addLog('Document fetch functions not found');
        addLog('Available fetch functions: ' + Object.keys(wasm).filter(k => typeof wasm[k] === 'function' && k.includes('fetch')).slice(0, 20).join(', '));
      }
    } catch (error) {
      addLog(`Error fetching documents: ${error}`);
      console.error('Full error object:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };
  
  const testViaProxy = async () => {
    addLog('Testing evonode connection via API proxy...');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/test-evonode', {
        method: 'GET'
      });
      
      const result = await response.json();
      addLog(`Proxy test result: ${JSON.stringify(result, null, 2)}`);
      
      if (result.success) {
        addLog('✅ Server can connect to evonode!');
      } else {
        addLog('❌ Server connection failed');
      }
    } catch (error) {
      addLog(`Proxy test error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const runDebugTests = async () => {
    addLog('Running comprehensive WASM SDK debug tests...');
    setIsLoading(true);
    
    try {
      if (client) {
        const { sdk, wasm } = client;
        await runAllDebugTests((msg) => addLog(msg), wasm, sdk);
      } else {
        addLog('Loading WASM module for debug tests...');
        const DashModule = await import('@/wasm/wasm_sdk');
        await runAllDebugTests((msg) => addLog(msg), DashModule);
      }
      addLog('✅ Debug tests complete');
    } catch (error) {
      addLog(`Debug test error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Direct WASM SDK Test</h1>
      
      <div className="mb-8 space-x-4">
        <button
          onClick={testDirectConnection}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded"
        >
          Test Direct Connections
        </button>
        
        <button
          onClick={testGetIdentity}
          disabled={!client || isLoading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded"
        >
          Get Identity Balance
        </button>
        
        <button
          onClick={testGetDocuments}
          disabled={!client || isLoading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded"
        >
          Get Documents
        </button>
        
        <button
          onClick={clearLogs}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
        >
          Clear Logs
        </button>
        
        <button
          onClick={testViaProxy}
          disabled={isLoading}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 rounded"
        >
          Test Via Server Proxy
        </button>
        
        <button
          onClick={runDebugTests}
          disabled={isLoading}
          className="px-4 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 rounded"
        >
          Run Debug Tests
        </button>
      </div>
      
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Logs {isLoading && '(Loading...)'}
          </h2>
          <button
            onClick={() => {
              const allLogs = logs.join('\n');
              navigator.clipboard.writeText(allLogs).then(() => {
                addLog('✅ Logs copied to clipboard!');
              }).catch(err => {
                addLog(`❌ Failed to copy logs: ${err}`);
              });
            }}
            disabled={logs.length === 0}
            className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-900 disabled:text-gray-600 rounded text-sm"
          >
            Copy All Logs
          </button>
        </div>
        <div className="font-mono text-sm space-y-1 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-gray-400">No logs yet. Click a button to start testing.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-gray-300">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="mt-8 text-sm text-gray-400">
        <p>Target Identity: 5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk</p>
        <p>Network: Testnet</p>
        <p>This page tests the WASM SDK directly without any monitoring or wrapper code.</p>
      </div>
    </div>
  );
}