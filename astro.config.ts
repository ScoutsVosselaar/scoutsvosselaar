import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import { deployment } from './deployment.config';
import sitemap from '@astrojs/sitemap';
import { sveltiaCms } from './src/cms/integration';
import { voskePages } from './src/integrations/voske-pages';
import { redirects } from './src/redirects';
import { rehypeSiteLinks } from './src/lib/site-links';

export default defineConfig({
  site: deployment.siteUrl,
  base: deployment.basePath,
  trailingSlash: 'always',
  build: { format: 'directory' },
  redirects,
  markdown: { rehypePlugins: [rehypeSiteLinks({ basePath: deployment.basePath })] },
  integrations: [sveltiaCms(deployment), voskePages(), sitemap({ filter: (page) => !page.includes('/admin/') })],
  vite: { plugins: [tailwindcss()] },
});
