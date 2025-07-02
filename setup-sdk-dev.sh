#!/bin/bash

echo "Setting up JS SDK Development Environment"
echo "========================================"
echo ""

# Check if platform repo exists
if [ ! -d "../platform" ]; then
  echo "❌ Platform repository not found at ../platform"
  echo "   Please clone it first:"
  echo "   cd .. && git clone https://github.com/dashpay/platform.git"
  exit 1
fi

# Check if symlink exists
if [ ! -L "src/dash-sdk-src" ]; then
  echo "Creating symlink to SDK source..."
  ln -s ../../platform/packages/js-dash-sdk/src ./src/dash-sdk-src
  echo "✅ Symlink created"
else
  echo "✅ Symlink already exists"
fi

# Check for wasm-pack
if ! command -v wasm-pack &> /dev/null; then
  echo ""
  echo "⚠️  wasm-pack not found (needed to build SDK)"
  echo "   Install with: curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh"
  echo "   Or visit: https://rustwasm.github.io/wasm-pack/installer/"
fi

# Show current setup
echo ""
echo "Current Setup:"
echo "-------------"
echo "NFT App: $(pwd)"
echo "SDK Source: $(readlink src/dash-sdk-src)"
echo ""
echo "SDK Package Info:"
if [ -f "../platform/packages/js-dash-sdk/package.json" ]; then
  echo -n "  Name: "
  grep '"name"' ../platform/packages/js-dash-sdk/package.json | head -1
  echo -n "  Version: "
  grep '"version"' ../platform/packages/js-dash-sdk/package.json | head -1
fi

echo ""
echo "Development Workflow:"
echo "-------------------"
echo "1. Run NFT app: npm run dev"
echo "2. Edit SDK wrapper: src/lib/dash-sdk-wrapper.ts"
echo "3. When ready, implement in real SDK: ../platform/packages/js-dash-sdk/src/"
echo "4. See DEVELOPMENT.md for detailed guide"
echo ""
echo "✅ Setup complete!"