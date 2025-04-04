const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",  // React frontend
    env: {
      apiUrl: "http://localhost:500/YOUR_FIREBASE_PROJECT/us-central1/api" // Firebase backend
    },
    setupNodeEvents(on, config) {
      // Implement event listeners here
    }
  }
});
