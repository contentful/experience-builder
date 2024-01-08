// vitest.config.ts
import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  //@ts-expect-error ignore
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
      reportsDirectory: 'reports',
    },
    environment: 'happy-dom',
  },
});
