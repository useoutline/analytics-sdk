import { defineConfig } from 'vitest/config'
import { resolve } from 'path'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      reporter: ['lcov', 'json', 'html'],
      exclude: [
        '**/*.config.*',
        '**/lib/index.umd.ts',
        'node_modules',
        'dist',
        'coverage',
        'types',
      ],
    },
    include: ['**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'coverage', 'types'],
  },
  plugins: [tsConfigPaths()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib'),
    },
  },
})
