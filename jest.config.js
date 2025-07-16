module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>'],
  testMatch: [
    '<rootDir>/src/test/*.test.ts',
    '<rootDir>/src/test/*.test.tsx',
    '<rootDir>/src/**/__tests__/**/*.test.ts',
    '<rootDir>/src/**/__tests__/**/*.test.tsx',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'src/dash-sdk-src/**/*.ts',
    '!src/dash-sdk-src/**/*.d.ts',
    '!src/dash-sdk-src/**/index.ts', 
    '!src/dash-sdk-src/**/types.ts',
  ],
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
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
  transformIgnorePatterns: [
    'node_modules/(?!(@dashpay)/)'
  ],
};