// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

// the blog is a separate app served at /blog in production;
// proxy it locally so the browser fetch of /blog/rss.xml works.
const blogProxy = {
  '/blog': { target: 'https://alexradu.co', changeOrigin: true }
};

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  vite: {
    server: {
      allowedHosts: true,
      proxy: blogProxy
    },
    preview: {
      allowedHosts: true,
      proxy: blogProxy
    }
  }
});