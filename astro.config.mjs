import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Static output — every page is pre-rendered to HTML so the marketing SEO
// (meta, hreflang, JSON-LD) ships in the initial payload. framer-motion runs
// only inside hydrated React islands.
export default defineConfig({
  site: 'https://avocloud.net',
  integrations: [react()],
  vite: { plugins: [tailwindcss()] },
  server: { port: 8899 },
  devToolbar: { enabled: false },
});
