import baseConfig from './rollup.base.config.js'

export default {
  ...baseConfig,
  input: 'lib/index.ts',
  output: {
    file: 'dist/useoutline-analytics.esm.js',
    format: 'es',
    compact: true,
  },
}
