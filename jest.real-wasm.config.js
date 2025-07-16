// Jest configuration for real WASM tests - no mocks!
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  testMatch: ['<rootDir>/src/test/real-wasm-node.test.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // NO setupFilesAfterEnv - we don't want any mocks
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
      }
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'wasm'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  testTimeout: 60000,
  // Ensure WASM files are treated as assets
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'wasm'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        moduleResolution: 'node',
      }
    }],
    '^.+\\.wasm$': '<rootDir>/src/test/wasm-transformer.js',
  },
};