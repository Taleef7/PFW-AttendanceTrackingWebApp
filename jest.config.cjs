module.exports = {
    testEnvironment: 'node', // or 'jsdom' if you're testing browser-specific code.
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    setupFilesAfterEnv: ['./src/__tests__/setupTests.js'], // Optional setup file
    transformIgnorePatterns: [
      "node_modules/(?!axios)/",
      "^.+\\.css$",
      "^.+\\.(js|jsx|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$",
    ],
  };