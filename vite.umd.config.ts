import { defineConfig } from 'vite'
import { resolve } from 'path'

// UMD build configuration
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.umd.ts'),
      name: 'useoutlineAnalytics',
      formats: ['umd'],
      fileName: () => 'index.umd.js',
    },
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false,
      },
      ecma: 2015,
    },
    sourcemap: false,
    outDir: 'dist',
    emptyOutDir: false, // Prevent wiping the dist directory
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib'),
    },
  },
})
