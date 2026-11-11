/**
 * Links in the content to the site's own domain (often copied from the old
 * WordPress site, e.g. `https://www.scoutsvosselaar.be/kalender/`) become
 * links within the site, so they keep working on whatever address the site is
 * served from. Old WordPress paths go to the redirect pages from
 * src/redirects.ts. Files that only exist on the old server stay as they are.
 *
 * No `import.meta.env` here: this also runs from astro.config.ts.
 */
const OWN_DOMAIN = /^(?:https?:)?\/\/(?:www\.)?scoutsvosselaar\.be(?=[/?#]|$)/i;

export function toSiteLink(href: string, basePath: string): string {
  const match = OWN_DOMAIN.exec(href.trim());
  if (!match) return href;
  const rest = href.trim().slice(match[0].length) || '/';
  if (/^\/wordpress\//i.test(rest)) return href;
  const path = rest.startsWith('/') ? rest : `/${rest}`;
  return `${basePath.replace(/\/+$/, '')}${path}`;
}

interface HastNode {
  type: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
}

/** Rehype plugin that applies `toSiteLink` to every `<a href>` in Markdown. */
export function rehypeSiteLinks(options: { basePath: string }) {
  const visit = (node: HastNode) => {
    if (node.type === 'element' && node.tagName === 'a' && typeof node.properties?.href === 'string') {
      node.properties.href = toSiteLink(node.properties.href, options.basePath);
    }
    node.children?.forEach(visit);
  };
  return () => (tree: HastNode) => visit(tree);
}
