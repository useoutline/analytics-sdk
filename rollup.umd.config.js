import baseConfig from './rollup.base.config.js'

export default {
  ...baseConfig,
  input: ['lib/index.umd.ts'],
  output: [
    {
      format: 'umd',
      file: 'dist/index.umd.js',
      compact: true,
    },
  ],
}
