#!/bin/bash

# Dash Platform Contract Registration Script
# This script registers the NFT contract using the Dash CLI

echo "=== Dash Platform NFT Contract Registration ==="
echo "Network: Testnet"
echo ""

# Set credentials
export DASH_IDENTITY_ID="5DbLwAxGBzUzo81VewMUwn4b5P4bpv9FNFybi25XB5Bk"
export DASH_PRIVATE_KEY="XK6CFyvYUMvY9FVQLeYBZBFDbC4QuBLiqWMAFxBVZcMHJ5eARJtf"

# Check if dash-cli is installed
if ! command -v dash &> /dev/null; then
    echo "❌ dash-cli not found. Installing..."
    npm install -g @dashevo/dash-cli
fi

echo "📄 Contract: contracts/nft3d-contract-final.json"
echo "🆔 Identity: $DASH_IDENTITY_ID"
echo ""

# Register the contract
echo "📝 Registering contract..."
dash contract create \
    --network testnet \
    --identity "$DASH_IDENTITY_ID" \
    --private-key "$DASH_PRIVATE_KEY" \
    --definition contracts/nft3d-contract-final.json

# Check if successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Contract registered successfully!"
    echo "Don't forget to update your .env file with the contract ID"
else
    echo ""
    echo "❌ Contract registration failed"
    echo "Please check the error message above"
fi