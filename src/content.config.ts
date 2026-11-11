import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CONTENT_DIR } from './lib/content-dir';
import { contentWarning } from './lib/log';
import {
  bool,
  imageHelpers,
  dayMonth,
  hexColor,
  limitedText,
  list,
  localDateTime,
  optionalText,
  optionalUrl,
  soft,
  text,
} from './lib/schema';

const json = (dir: string) => glob({ pattern: '*.json', base: `./${CONTENT_DIR}/${dir}` });
const markdown = (dir: string) => glob({ pattern: '*.md', base: `./${CONTENT_DIR}/${dir}` });

const refs = <C extends Parameters<typeof reference>[0]>(field: string, collection: C) =>
  list(field, reference(collection));

/** Instellingen (singleton: settings/site.json). */
const settings = defineCollection({
  loader: json('settings'),
  schema: z.object({
    currentYear: soft('currentYear', reference('scout-years').optional(), undefined),
  }),
});

/** Takken. Created and removed in code only. */
const sections = defineCollection({
  loader: json('sections'),
  schema: ({ image }) => {
    const img = imageHelpers(image, 'sections');
    return z.object({
      name: text('name'),
      ageRange: text('ageRange'),
      shortDescription: limitedText('shortDescription', 400),
      who: text('who'),
      what: text('what'),
      camp: text('camp'),
      meetingTime: text('meetingTime'),
      email: optionalText('email'),
      leaderLabel: soft('leaderLabel', z.string().trim().min(1), 'Leiding'),
      color: hexColor('color', '#6b4f3a'),
      image: img.optionalImage('image'),
      order: soft('order', z.number(), 99),
    });
  },
});

/** Leiding. A person exists across scout years. */
const leaders = defineCollection({
  loader: json('leaders'),
  schema: ({ image }) => {
    const img = imageHelpers(image, 'leaders');
    return z.object({
      firstName: text('firstName'),
      lastName: text('lastName'),
      totem: optionalText('totem'),
      voortotem: optionalText('voortotem'),
      photo: img.optionalImage('photo'),
      birthday: dayMonth('birthday'),
      email: optionalText('email'),
      phone: optionalText('phone'),
      bio: limitedText('bio', 300),
    });
  },
});

/** Werkjaren. */
const scoutYears = defineCollection({
  loader: json('scout-years'),
  schema: ({ image }) => {
    const img = imageHelpers(image, 'scout-years');
    return z.object({
      label: text('label'),
      theme: optionalText('theme'),
      startDate: localDateTime('startDate'),
      endDate: localDateTime('endDate'),
      groupLeaders: refs('groupLeaders', 'leaders'),
      sectionTeams: list(
        'sectionTeams',
        z.object({
          section: soft('sectionTeams.section', reference('sections').optional(), undefined),
          leaders: refs('sectionTeams.leaders', 'leaders'),
          sectionLeads: refs('sectionTeams.sectionLeads', 'leaders'),
        }),
      ),
      groupPhotos: img.images('groupPhotos', 10),
    });
  },
});

/** Evenementen. */
const events = defineCollection({
  loader: markdown('events'),
  schema: ({ image }) => {
    const img = imageHelpers(image, 'events');
    return z.object({
      title: text('title'),
      start: localDateTime('start'),
      end: localDateTime('end'),
      allDay: bool('allDay'),
      location: optionalText('location'),
      sections: refs('sections', 'sections'),
      forLeaders: bool('forLeaders'),
      price: optionalText('price'),
      image: img.optionalImage('image'),
      linkUrl: optionalUrl('linkUrl'),
      linkLabel: optionalText('linkLabel'),
      cancelled: bool('cancelled'),
    });
  },
});

/** Berichten. */
const posts = defineCollection({
  loader: markdown('posts'),
  schema: ({ image }) => {
    const img = imageHelpers(image, 'posts');
    return z.object({
      title: text('title'),
      date: localDateTime('date'),
      excerpt: limitedText('excerpt', 200),
      coverImage: img.optionalImage('coverImage'),
      gallery: img.images('gallery', 12),
      videoUrl: optionalUrl('videoUrl'),
      buttonUrl: optionalUrl('buttonUrl'),
      buttonLabel: optionalText('buttonLabel'),
      sections: refs('sections', 'sections'),
      pinned: bool('pinned'),
      draft: bool('draft'),
    });
  },
});

/** 't Voske. The PDF lives in public/voske/. */
const voskes = defineCollection({
  loader: json('voskes'),
  schema: ({ image }) => {
    const img = imageHelpers(image, 'voskes');
    return z.object({
      title: text('title'),
      date: localDateTime('date'),
      pdf: optionalText('pdf'),
      cover: img.optionalImage('cover'),
    });
  },
});

/** Fotoalbums. Only a cover and a link to an external album. */
const albums = defineCollection({
  loader: json('albums'),
  schema: ({ image }) => {
    const img = imageHelpers(image, 'albums');
    return z.object({
      title: text('title'),
      date: localDateTime('date'),
      sections: refs('sections', 'sections'),
      coverImage: img.optionalImage('coverImage'),
      albumUrl: optionalUrl('albumUrl'),
    });
  },
});

/** A block of a page. `type` decides what the block shows besides its text (see src/cms/config.ts). */
const pageBlock = z.object({
  type: soft('blocks.type', z.enum(['text', 'emails', 'meetings', 'groupLeaders']), 'text'),
  title: text('blocks.title'),
  body: text('blocks.body'),
  buttonLabel: optionalText('blocks.buttonLabel'),
  buttonUrl: optionalText('blocks.buttonUrl'),
  buttonFile: optionalText('blocks.buttonFile'),
  bodyAfter: text('blocks.bodyAfter'),
  extra: list('blocks.extra', z.object({ label: text('blocks.extra.label'), email: text('blocks.extra.email') })),
});

/** Fixed pages (Inschrijven, Praktisch, ...): their text and blocks. Created in code only. */
const pages = defineCollection({
  loader: json('pages'),
  schema: z.object({
    title: text('title'),
    description: optionalText('description'),
    intro: optionalText('intro'),
    // An invalid block is left out; the other blocks are still shown.
    blocks: soft('blocks', z.array(z.unknown()), []).transform((items) =>
      items.flatMap((item, i) => {
        const block = pageBlock.safeParse(item);
        if (block.success) return [block.data];
        contentWarning(`Ongeldig blok ${i + 1} op een pagina: ${JSON.stringify(item).slice(0, 60)}. Overgeslagen.`);
        return [];
      }),
    ),
  }),
});

export const collections = {
  pages,
  settings,
  sections,
  leaders,
  'scout-years': scoutYears,
  events,
  posts,
  voskes,
  albums,
};
