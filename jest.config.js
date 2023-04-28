export default {
  resetMocks: true,
  roots: ['./src'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: './reports',
  setupFilesAfterEnv: ['./testing-library.js'],
}
