import baseConfig from './rollup.base.config.js'

export default {
  ...baseConfig,
  input: ['lib/index.ts'],
  output: [
    {
      dir: 'dist',
      format: 'es',
      compact: true,
    },
  ],
}
