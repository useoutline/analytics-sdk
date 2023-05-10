import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { handleCircularDependancyWarning } from 'node-stdlib-browser/helpers/rollup/plugin'

const baseConfig = {
  input: './lib/index.ts',
  plugins: [
    typescript({ module: 'esnext' }),
    commonjs({
      requireReturnsDefault: 'auto',
    }),
    terser({ ecma: '2015', format: { comments: false } }),
  ],
  onwarn: (warning, rollupWarn) => {
    handleCircularDependancyWarning(warning, rollupWarn)
  },
}

export default baseConfig
