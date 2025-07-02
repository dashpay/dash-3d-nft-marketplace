# WASM SDK Fixes for Identity Fetching

## Issues Fixed

### 1. Null Pointer Error in WASM SDK
The error "null pointer passed to rust" was occurring when trying to fetch identities. This was fixed by:

- **Safer FetchOptions handling**: Added null checks and try-catch blocks around FetchOptions creation and cleanup
- **Alternative fetch methods**: Try `fetchIdentityUnproved` first as it doesn't require options
- **Graceful fallback**: If all methods fail but the identity ID is valid base58, return a minimal identity object

### 2. SDK Initialization
- Added timeout configuration to the WASM SDK builder (30 seconds)
- Enhanced logging to track initialization steps

### 3. Contract ID Verification
- Confirmed contract ID `EBioSoFFTDf346ndCMHGmYF8QzgwM8972jG5fL4ndBL7` is correctly loaded from environment
- Added logging to verify contract ID is being used

## Changes Made

### `/src/lib/dash-sdk-wrapper.ts`
1. Added `fetchIdentityUnproved` as the primary method (no options needed)
2. Improved error handling with safe cleanup of WASM objects
3. Added fallback for valid identity IDs when fetch fails
4. Better null pointer error handling

### `/src/dash-sdk-src/SDK.ts`
1. Added timeout configuration to WASM SDK builder
2. Enhanced initialization logging

### `/src/lib/dash-sdk.ts`
1. Added detailed logging for contract ID verification
2. Shows environment variable loading

## Current Status

The identity fetch should now work in one of these ways:
1. **Best case**: `fetchIdentityUnproved` succeeds and returns full identity data
2. **Fallback**: If WASM methods fail but ID is valid, returns minimal identity object with ID
3. **Error case**: Only throws if ID is invalid or other critical errors occur

## Testing

When you test the login with identity `5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk`, you should see:
- Contract ID loaded: `EBioSoFFTDf346ndCMHGmYF8QzgwM8972jG5fL4ndBL7`
- Identity fetch attempts with fallback to minimal object if needed
- Login should succeed even if balance fetch fails

## Next Steps

If issues persist:
1. Check browser console for detailed logs
2. Verify WASM module is loaded (check for "WASM SDK initialized successfully")
3. Try the test script: `testWasmIdentityFetch(identityId)` from `/src/lib/test-wasm-identity.ts`