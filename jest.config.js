const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  automock: false,
  collectCoverage: true,
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
}

// eslint-disable-next-line no-undef
export default config
