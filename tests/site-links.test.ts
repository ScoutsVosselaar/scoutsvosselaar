import { describe, expect, it } from 'vitest';
import { toSiteLink } from '../src/lib/site-links';

describe('toSiteLink', () => {
  it('maakt van links naar het eigen domein links binnen de site', () => {
    expect(toSiteLink('https://www.scoutsvosselaar.be/kalender/', '/scoutsvosselaar')).toBe('/scoutsvosselaar/kalender/');
    expect(toSiteLink('http://scoutsvosselaar.be/lidworden/', '/scoutsvosselaar/')).toBe('/scoutsvosselaar/lidworden/');
    expect(toSiteLink('https://scoutsvosselaar.be', '/scoutsvosselaar')).toBe('/scoutsvosselaar/');
    expect(toSiteLink('//www.scoutsvosselaar.be/kalender/#tak-welpen', '/')).toBe('/kalender/#tak-welpen');
  });

  it('laat andere links ongemoeid', () => {
    for (const href of [
      'https://forms.gle/abc',
      'https://scoutsvosselaar.be.example.com/',
      'https://www.scoutsvosselaar.be/wordpress/wp-content/uploads/a.pdf',
      'mailto:info@scoutsvosselaar.be',
      '/kalender/',
      '#top',
    ]) {
      expect(toSiteLink(href, '/scoutsvosselaar')).toBe(href);
    }
  });
});
