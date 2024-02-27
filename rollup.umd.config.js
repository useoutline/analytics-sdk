import baseConfig from './rollup.base.config.js'

export default {
  ...baseConfig,
  input: 'lib/index.umd.ts',
  output: {
    file: 'dist/index.umd.js',
    format: 'umd',
    compact: true,
    name: 'useoutlineAnalytics',
  },
}
