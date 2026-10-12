import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Static output — every page is pre-rendered to HTML so the marketing SEO
// (meta, hreflang, JSON-LD) ships in the initial payload. All motion is GSAP,
// running inside hydrated React islands.
export default defineConfig({
  site: 'https://avocloud.net',
  // Sitemap is generated from the actual routes. The hand-written
  // public/sitemap.xml it replaces had drifted: three URLs 404'd
  // (/craftattack.html, /fabi.html, /impressum.html — the real routes are
  // directories) and /regulations/ and /mail/ were missing entirely.
  integrations: [
    react(),
    sitemap({
      // noindex pages have no business in a sitemap
      filter: (page) => !page.includes('/mail/') && !page.includes('/404'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  server: { port: 8899 },
  devToolbar: { enabled: false },
});
