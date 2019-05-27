module.exports = {
  testMatch: ['**/?(*.)(spec|test|e2e).(j|t)s?(x)'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/examples/',
    '/lib/',
    '/babel-preset-mega/src/test.js',
    '/mega-scripts/src/commands/test.js',
  ],
  collectCoverageFrom: ['packages/*/lib/**/*.{ts,tsx,js,jsx}'],
};
