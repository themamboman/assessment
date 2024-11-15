module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
      extensionsToTreatAsEsm: ['.ts', '.tsx'], // Or ['.js', '.jsx'] for JavaScript files
  },
  testEnvironment: "jsdom"
};