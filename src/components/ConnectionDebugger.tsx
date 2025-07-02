'use client';

import { useState } from 'react';
import { setupConnectionMonitoring, testDirectConnection } from '@/lib/monitor-wasm-connection';
import { testWorkingEvonode } from '@/lib/test-working-evonode';
import { testWasmConnection } from '@/lib/test-wasm-connection';

export function ConnectionDebugger() {
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [testResults, setTestResults] = useState<string[]>([]);
  
  const enableMonitoring = () => {
    if (!isMonitoring) {
      setupConnectionMonitoring();
      setIsMonitoring(true);
      addResult('🔍 Connection monitoring enabled - check console for details');
    }
  };
  
  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };
  
  const testConnections = async () => {
    addResult('Starting connection tests...');
    
    // Test the working evonode
    try {
      addResult('Testing 52.13.132.146 (working evonode with valid SSL)...');
      await testWorkingEvonode();
      addResult('✅ Check console for detailed results');
    } catch (error) {
      addResult(`❌ Test failed: ${error.message}`);
    }
    
    // Test direct connections
    try {
      addResult('Testing direct connections to various ports...');
      await testDirectConnection();
      addResult('✅ Check console for detailed results');
    } catch (error) {
      addResult(`❌ Direct connection test failed: ${error.message}`);
    }
  };
  
  const checkWasmSdkEndpoints = () => {
    addResult('Checking what endpoints WASM SDK is trying to use...');
    addResult('Please try to login and watch the console for fetch requests');
  };
  
  const runWasmConnectionTest = async () => {
    addResult('Running WASM SDK connection test...');
    try {
      await testWasmConnection();
      addResult('✅ WASM connection test complete - check console for details');
    } catch (error) {
      addResult(`❌ WASM test failed: ${error.message}`);
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-md">
      <h3 className="text-lg font-bold mb-2">Connection Debugger</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={enableMonitoring}
          disabled={isMonitoring}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-3 py-1 rounded text-sm"
        >
          {isMonitoring ? '✅ Monitoring Enabled' : 'Enable Connection Monitoring'}
        </button>
        
        <button
          onClick={testConnections}
          className="w-full bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
        >
          Test Evonode Connections
        </button>
        
        <button
          onClick={checkWasmSdkEndpoints}
          className="w-full bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded text-sm"
        >
          Check WASM SDK Endpoints
        </button>
        
        <button
          onClick={runWasmConnectionTest}
          className="w-full bg-orange-600 hover:bg-orange-700 px-3 py-1 rounded text-sm"
        >
          Test WASM SDK Connection
        </button>
      </div>
      
      <div className="max-h-48 overflow-y-auto bg-black/50 p-2 rounded text-xs">
        {testResults.length === 0 ? (
          <p className="text-gray-400">Click buttons above to start debugging</p>
        ) : (
          testResults.map((result, i) => (
            <div key={i} className="mb-1">{result}</div>
          ))
        )}
      </div>
      
      <div className="mt-2 text-xs text-gray-400">
        <p>Known working evonode: 52.13.132.146</p>
        <p>Has valid SSL cert (expires Sep 2025)</p>
      </div>
    </div>
  );
}