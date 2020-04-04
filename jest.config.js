module.exports = {
  collectCoverageFrom: [
    'packages/**/src/**/*.{ts,tsx}',
    '!src/**/demo*.ts',
    '!src/*.ts',
  ],
  testMatch: [__dirname + '/packages/**/?(*.)(spec|test).ts?(x)'],
  // testEnvironment: 'node',
  testURL: 'http://localhost',
  preset: 'ts-jest',
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(ts|tsx)$'],
  moduleNameMapper: {
    'react-native$': 'react-native-web',
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['web.js', 'js', 'jsx', 'ts', 'json', 'web.tsx', 'tsx'],
};
