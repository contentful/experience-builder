// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  //@ts-expect-error ignore
  plugins: [
    tsconfigPaths({
      // Don't parse other tsconfig files outside of this package
      ignoreConfigErrors: true,
    }),
  ],
  test: {
    globals: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'reports',
    },
    environment: 'happy-dom',
  },
});
