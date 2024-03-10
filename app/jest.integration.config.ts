import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  reporters: ['default'],
  transformIgnorePatterns: ['^.+\\.js$'],
  testMatch: ['**/*.integration.ts'],
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.[ts]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
};

export default config;