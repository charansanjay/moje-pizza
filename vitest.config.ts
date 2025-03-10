/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts', // Path to a setup file for initial test configurations
    coverage: {
      clean: true, // Ensures coverage data is cleared before running tests
      cleanOnRerun: true, // Automatically cleans on re-run
    },
  },
});