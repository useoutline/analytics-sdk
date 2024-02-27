import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import terser from '@rollup/plugin-terser'
import { handleCircularDependancyWarning } from 'node-stdlib-browser/helpers/rollup/plugin'
import alias from '@rollup/plugin-alias'

const baseConfig = {
  plugins: [
    alias({
      '@': './lib',
    }),
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
