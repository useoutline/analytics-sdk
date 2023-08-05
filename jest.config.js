import { pathsToModuleNameMapper } from 'ts-jest'
import { readFileSync } from 'fs'

const tsConfig = JSON.parse(readFileSync('./tsconfig.json'))

const config = {
  verbose: true,
  testEnvironment: 'jsdom',
  automock: false,
  collectCoverage: true,
  preset: 'ts-jest',
  transform: {
    '^.+\\.ts$': 'babel-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(tsConfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
}

export default config
