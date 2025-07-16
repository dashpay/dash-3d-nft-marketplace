// Stub file for missing SDK
export class SDK {
  constructor(options: any) {}
  initialize() { return Promise.resolve(); }
  getNetwork() { return { name: 'testnet' }; }
  getApps() { return {}; }
  createContext() { return Promise.resolve({}); }
  getWasmSdk() { return null; }
  getWasmModule() { return null; }
}

export interface SDKOptions {
  network?: string;
  apps?: any;
  contextProvider?: any;
}