import { defineConfig } from 'vite'
import { resolve } from 'path'

// Redirecting to use separate configurations
// Use vite.esm.config.ts for ESM builds
// Use vite.umd.config.ts for UMD builds
export default defineConfig({
  // This file is not used directly anymore
  // It's kept as a reference and for compatibility
  resolve: {
    alias: {
      '@': resolve(__dirname, 'lib'),
    },
  },
})
