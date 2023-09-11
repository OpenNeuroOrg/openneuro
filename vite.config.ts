// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './test/setup.ts',
    clearMocks: true,
    maxConcurrency: 16,
    isolate: true,
  },
})
