// WASM transformer for Jest - just returns the file path
module.exports = {
  process(src, filename) {
    return {
      code: `module.exports = '${filename}';`,
    };
  },
};