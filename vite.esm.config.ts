import { defineConfig } from 'vite'
import { resolve } from 'path'

// ESM build configuration
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      formats: ['es'],
      fileName: () => 'index.esm.js',
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
    emptyOutDir: true, // Clean the output directory on ESM build
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib'),
    },
  },
})
