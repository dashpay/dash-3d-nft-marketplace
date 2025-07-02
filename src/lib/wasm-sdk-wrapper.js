/**
 * WASM SDK Wrapper - Fixes the SDK to use modern evonodes instead of deprecated DAPI endpoints
 */
import * as DashModule from '@/wasm/wasm_sdk';
// Modern testnet evonodes with gRPC-Web support
const TESTNET_EVONODES = [
    'https://52.13.132.146:1443',
    'https://52.89.154.48:1443',
    'https://44.227.137.77:1443',
    'https://52.40.219.41:1443',
    'https://54.149.33.167:1443',
    'https://54.187.14.232:1443',
    'https://52.12.176.90:1443',
    'https://52.34.144.50:1443',
    'https://44.239.39.153:1443',
];
export class WasmSdkWrapper {
    constructor(config) {
        this.config = config;
        this.originalFetch = window.fetch;
    }
    async initialize() {
        // Initialize WASM if needed
        if (typeof DashModule.default === 'function') {
            await DashModule.default();
        }
        else if (typeof DashModule.initSync === 'function') {
            DashModule.initSync();
        }
        // Intercept fetch to redirect old DAPI calls to evonodes
        this.setupFetchInterceptor();
        // Create SDK builder
        const builder = this.config.network === 'testnet'
            ? DashModule.WasmSdkBuilder.new_testnet()
            : DashModule.WasmSdkBuilder.new_mainnet();
        // Try to configure with DapiClientConfig if available
        if (DashModule.DapiClientConfig) {
            try {
                const dapiConfig = new DashModule.DapiClientConfig(this.config.network);
                // Add evonodes as endpoints
                const evonodes = this.config.evonodes || TESTNET_EVONODES;
                evonodes.forEach(evonode => {
                    if (typeof dapiConfig.addEndpoint === 'function') {
                        dapiConfig.addEndpoint(evonode);
                    }
                });
                // Set timeout and retries if specified
                if (this.config.timeout && typeof dapiConfig.setTimeout === 'function') {
                    dapiConfig.setTimeout(this.config.timeout);
                }
                if (this.config.retries && typeof dapiConfig.setRetries === 'function') {
                    dapiConfig.setRetries(this.config.retries);
                }
                // Create DapiClient with config
                const dapiClient = new DashModule.DapiClient(dapiConfig);
                // Try to set it on the builder (this might not work but worth trying)
                if (typeof builder.with_dapi_client === 'function') {
                    builder.with_dapi_client(dapiClient);
                }
            }
            catch (error) {
                console.warn('Failed to configure DapiClient:', error);
            }
        }
        // Build the SDK
        this.sdk = builder.build();
        return this.sdk;
    }
    setupFetchInterceptor() {
        const evonodes = this.config.evonodes || TESTNET_EVONODES;
        let currentEvonodeIndex = 0;
        // Override global fetch to intercept and redirect DAPI calls
        window.fetch = async (...args) => {
            let url = typeof args[0] === 'string' ? args[0] : args[0].url;
            const options = args[1] || {};
            // Check if this is a call to old DAPI endpoints
            if (url && (url.includes('testnet-dapi') || url.includes('mainnet-dapi'))) {
                // Extract the path from the old URL
                const urlObj = new URL(url);
                const path = urlObj.pathname;
                // Use round-robin to distribute load across evonodes
                const evonode = evonodes[currentEvonodeIndex];
                currentEvonodeIndex = (currentEvonodeIndex + 1) % evonodes.length;
                // Create new URL with evonode
                const newUrl = `${evonode}${path}`;
                console.log(`[WASM SDK] Redirecting ${url} → ${newUrl}`);
                // Update the request
                if (typeof args[0] === 'string') {
                    args[0] = newUrl;
                }
                else {
                    args[0] = new Request(newUrl, args[0]);
                }
                // Add gRPC-Web headers if not present
                if (!options.headers) {
                    options.headers = {};
                }
                options.headers['Content-Type'] = 'application/grpc-web+proto';
                options.headers['X-Grpc-Web'] = '1';
                args[1] = options;
            }
            // Call original fetch
            return this.originalFetch(...args);
        };
    }
    getSdk() {
        return this.sdk;
    }
    cleanup() {
        // Restore original fetch
        window.fetch = this.originalFetch;
        // Free SDK resources
        if (this.sdk && typeof this.sdk.free === 'function') {
            this.sdk.free();
        }
    }
}
// Convenience function for quick SDK creation
export async function createWasmSdk(network = 'testnet') {
    const wrapper = new WasmSdkWrapper({ network });
    return await wrapper.initialize();
}
// Export all WASM SDK functions and classes for convenience
export * from '@/wasm/wasm_sdk';
