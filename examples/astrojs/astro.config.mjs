// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  output: 'server',
  i18n: {
    defaultLocale: 'en-US',
    locales: ['en-US', 'de'],
  },
  adapter: node({
    mode: 'standalone',
  }),
});
