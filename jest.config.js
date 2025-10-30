export default {
  testEnvironment: 'node',
  transform: {},
  testMatch: ['**/__tests__/**/*.test.js'],
  collectCoverageFrom: [
    'server/**/*.js',
    '!server/__tests__/**',
  ],
  testTimeout: 10000,
  // Note: For ES modules to work with Jest, you need Node.js with experimental flag
  // Run with: node --experimental-vm-modules node_modules/jest/bin/jest.js
};

