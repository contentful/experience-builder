// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  //@ts-expect-error ignore
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'reports',
    },
    environment: 'jsdom',
    // using 'forks' instead of 'threads' as pact crashes with 'threads'
    pool: 'forks',
  },
});
