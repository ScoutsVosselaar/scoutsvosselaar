/**
 * Renders Markdown strings from JSON content (e.g. the Wie/Wat/Kamp blocks of
 * a section) with Astro's own Markdown processor.
 */
import { createMarkdownProcessor, type MarkdownRenderer } from '@astrojs/markdown-remark';
import { rehypeSiteLinks } from './site-links';

let processor: Promise<MarkdownRenderer> | undefined;

export async function renderMarkdown(source: string): Promise<string> {
  processor ??= createMarkdownProcessor({
    syntaxHighlight: false,
    rehypePlugins: [rehypeSiteLinks({ basePath: import.meta.env.BASE_URL })],
  });
  const { code } = await (await processor).render(source);
  return code;
}
