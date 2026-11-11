/**
 * Fixed group data, managed in code by the webmaster. The text of the fixed
 * pages (Inschrijven, Praktisch, ...) is in src/content/pages/ and the CMS.
 *
 * Values that are still `undefined` are not shown on the site; the build lists
 * them as a warning. They come from docs/huidige-site/inhoud.md (§2 and §7).
 */
type Maybe = string | undefined;

export const site = {
  name: 'Scouts Don Bosco Vosselaar',
  shortName: 'Scouts Vosselaar',
  groupNumber: 'A4108G',
  federation: 'Scouts en Gidsen Vlaanderen',
  gouw: 'Gouw Kempen',
  district: 'District Noorderkempen',
  email: 'info@scoutsvosselaar.be',
  address: {
    street: 'Konijnenbergpad 2Y' as Maybe,
    postalCode: '2350',
    city: 'Vosselaar',
  },
} as const;

export interface NavItem {
  label: string;
  href: string;
}

/** Main menu, in this order. */
export const navigation: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Kalender', href: '/kalender/' },
  { label: 'Takken', href: '/takken/' },
  { label: 'Leiding', href: '/leiding/' },
  { label: "Foto's", href: '/fotos/' },
  { label: "'t Voske", href: '/voske/' },
  { label: 'Inschrijven', href: '/inschrijven/' },
  { label: 'Praktisch', href: '/praktisch/' },
  { label: 'Verhuur', href: '/verhuur/' },
  { label: 'Onze groep', href: '/onze-groep/' },
];

/** Shortcuts that stay visible on small screens. */
export const quickLinks: NavItem[] = [
  { label: 'Kalender', href: '/kalender/' },
  { label: 'Inschrijven', href: '/inschrijven/' },
];
