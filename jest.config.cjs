/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/__tests__/unit'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFilesAfterEnv: [],
  testMatch: ['**/__tests__/unit/**/*.(ts|tsx|js)', '**/__tests__/unit/?(*.)+(spec|test).(ts|tsx|js)'],
};
