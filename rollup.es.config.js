import baseConfig from './rollup.base.config.js'

export default {
  ...baseConfig,
  input: ['lib/index.ts'],
  output: [
    {
      dir: 'dist/lib',
      format: 'es',
      compact: true,
    },
  ],
}
