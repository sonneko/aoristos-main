// @ts-check
import { defineConfig } from 'astro/config';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://sonneko.github.io',
  base: '/aoristos-main',
  integrations: [tailwind()],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "/src/styles/_mixin.scss";`
        }
      }
    }
  },
});