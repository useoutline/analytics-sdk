import baseConfig from './rollup.base.config.js'

export default {
  ...baseConfig,
  input: 'lib/index.umd.ts',
  output: {
    file: 'dist/useoutline-analytics.umd.js',
    format: 'umd',
    compact: true,
    name: 'useoutlineAnalytics',
  },
}
