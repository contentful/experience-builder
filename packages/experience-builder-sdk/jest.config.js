export default {
  resetMocks: true,
  roots: ['./src'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: './reports',
  setupFilesAfterEnv: ['./testing-library.js'],
  moduleNameMapper: {
    '\\.(css)$': '<rootDir>/test/styleMock.ts',
    '^.+\\.svg$': '<rootDir>/test/fileMock.ts',
    '^.+\\.svg\\?react$': '<rootDir>/test/fileMock.ts',
  },
  transform: {
    '\\.[jt]sx?$': ['ts-jest'],
  },
  transformIgnorePatterns: ['node_modules/(?!@contentful/.*/.*|style-inject)'],
};
