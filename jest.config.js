const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  automock: false,
  collectCoverage: true,
  preset: 'ts-jest',
  transform: {
    '^.+\\.[t|j]s$': 'babel-jest',
  },
}

// eslint-disable-next-line no-undef
export default config
