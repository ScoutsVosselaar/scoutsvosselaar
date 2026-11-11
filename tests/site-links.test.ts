import { describe, expect, it } from 'vitest';
import { toContentLink, toSiteLink } from '../src/lib/site-links';

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

describe('toContentLink', () => {
  it('zet het base path voor een pad op de site', () => {
    expect(toContentLink('/docs/plan.pdf', '/scoutsvosselaar')).toBe('/scoutsvosselaar/docs/plan.pdf');
    expect(toContentLink('/docs/plan.pdf', '/scoutsvosselaar/')).toBe('/scoutsvosselaar/docs/plan.pdf');
    expect(toContentLink('/docs/plan.pdf', '/')).toBe('/docs/plan.pdf');
    expect(toContentLink('https://www.scoutsvosselaar.be/kalender/', '/scoutsvosselaar')).toBe('/scoutsvosselaar/kalender/');
  });

  it('zet het base path er niet twee keer voor en laat andere links staan', () => {
    expect(toContentLink('/scoutsvosselaar/kalender/', '/scoutsvosselaar')).toBe('/scoutsvosselaar/kalender/');
    for (const href of ['https://www.hopper.be', 'mailto:info@scoutsvosselaar.be', 'tel:+3214600843', '#top', '//cdn.example.com/a.js']) {
      expect(toContentLink(href, '/scoutsvosselaar')).toBe(href);
    }
  });
});
