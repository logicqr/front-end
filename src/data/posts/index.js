/**
 * The guides cluster.
 *
 * Content lives as code rather than in a CMS on purpose: it ships in the bundle
 * (so it is in the HTML a crawler sees once the page prerenders), it is version
 * controlled, and it needs no database round trip or admin UI to publish.
 *
 * Structure is a hub-and-spoke cluster. `how-to-get-more-google-reviews` is the
 * pillar and every spoke links back to it; the spokes link sideways where the
 * topics genuinely overlap. That internal linking is most of what makes a small
 * site rank for a competitive head term.
 *
 * Each post declares the search intent it targets in `keywords` — primary term
 * first. Nothing here is keyword-stuffed; the terms are the ones the piece
 * actually answers.
 */

export const CATEGORIES = {
  basics: { label: 'Getting started', color: 'c-sage' },
  growth: { label: 'Getting more reviews', color: 'c-butter' },
  policy: { label: 'Rules & compliance', color: 'c-blush' },
  seo: { label: 'Local SEO', color: 'c-lilac' },
  handling: { label: 'Handling feedback', color: 'c-sky' },
};

/**
 * Registry. `load` is a dynamic import so each post is its own chunk and the
 * blog index does not ship every article's body.
 */
export const POSTS = [
  {
    slug: 'how-to-get-more-google-reviews',
    title: 'How to get more Google reviews: the practical guide',
    description:
      'Thirteen things that actually move the number, ranked by how much work they are. Includes the asking scripts, the timing that works, and the three mistakes that get listings penalised.',
    excerpt:
      "Most advice on this is a list of things nobody does twice. Here is what holds up when you are also running the business: where to ask, when to ask, what to say, and what Google will penalise you for.",
    category: 'growth',
    published: '2026-02-18',
    updated: '2026-11-11',
    readingMinutes: 14,
    wordCount: 2600,
    pillar: true,
    keywords: [
      'how to get more google reviews',
      'get more google reviews',
      'increase google reviews',
      'ask customers for reviews',
      'google review strategy',
    ],
    load: () => import('./how-to-get-more-google-reviews.jsx'),
  },
  {
    slug: 'google-review-link',
    title: 'How to find and share your Google review link',
    description:
      'Where the short review link lives in your Business Profile, how to shorten it, and the eight places worth putting it. With the exact click path, because Google moves it.',
    excerpt:
      'Your review link is the single highest-leverage thing on this list, and most businesses have never found it. Here is where it is hiding and what to do with it.',
    category: 'basics',
    published: '2026-03-04',
    updated: '2026-11-11',
    readingMinutes: 7,
    wordCount: 1400,
    keywords: [
      'google review link',
      'how to get google review link',
      'google review link generator',
      'share google review link',
      'direct google review link',
    ],
    load: () => import('./google-review-link.jsx'),
  },
  {
    slug: 'qr-code-for-google-reviews',
    title: 'QR codes for Google reviews: what works and what gets ignored',
    description:
      'Where to place a review QR code, what the card should say, what size to print it, and why most review QR codes collect nothing.',
    excerpt:
      'A QR code on the counter beats every email campaign we have seen — but only if it is in the right place with the right words on it. Most are not.',
    category: 'basics',
    published: '2026-03-21',
    updated: '2026-11-11',
    readingMinutes: 9,
    wordCount: 1700,
    keywords: [
      'qr code for google reviews',
      'google review qr code',
      'review qr code placement',
      'qr code review card',
      'nfc review stand',
    ],
    load: () => import('./qr-code-for-google-reviews.jsx'),
  },
  {
    slug: 'review-gating-google-policy',
    title: 'Review gating: what Google actually prohibits',
    description:
      'Filtering out unhappy customers before asking for a public review is against Google policy and has drawn FTC action. What the rules say, what the penalties are, and how to collect private feedback without breaking them.',
    excerpt:
      'Plenty of review tools quietly do this, including parts of ours. Here is the policy in plain terms, what it risks, and the compliant way to get the same benefit.',
    category: 'policy',
    published: '2026-04-09',
    updated: '2026-11-11',
    readingMinutes: 11,
    wordCount: 2100,
    keywords: [
      'review gating',
      'google review policy',
      'is review gating allowed',
      'google prohibited content reviews',
      'ftc fake reviews rule',
    ],
    load: () => import('./review-gating-google-policy.jsx'),
  },
  {
    slug: 'how-to-respond-to-negative-reviews',
    title: 'How to respond to a bad Google review',
    description:
      'A structure that works in four sentences, eleven templates you can adapt, and the three replies that make things measurably worse.',
    excerpt:
      'The reply is not for the person who complained. It is for the next forty people who read it while deciding whether to come in.',
    category: 'handling',
    published: '2026-05-14',
    updated: '2026-11-11',
    readingMinutes: 12,
    wordCount: 2200,
    keywords: [
      'how to respond to negative google reviews',
      'bad review response examples',
      'respond to google review',
      'negative review reply template',
      'remove google review',
    ],
    load: () => import('./how-to-respond-to-negative-reviews.jsx'),
  },
  {
    slug: 'google-reviews-local-seo',
    title: 'How Google reviews affect local search ranking',
    description:
      'Which parts of your review profile Google says it uses, what review velocity means in practice, and why the keywords inside reviews matter more than the star rating.',
    excerpt:
      'Reviews are one of three things Google says decides local ranking. Here is the part of that you can actually influence, and the part you cannot.',
    category: 'seo',
    published: '2026-06-02',
    updated: '2026-11-11',
    readingMinutes: 10,
    wordCount: 1900,
    keywords: [
      'google reviews local seo',
      'do reviews affect google ranking',
      'local pack ranking factors',
      'review velocity',
      'google business profile ranking',
    ],
    load: () => import('./google-reviews-local-seo.jsx'),
  },
  {
    slug: 'how-many-google-reviews-do-you-need',
    title: 'How many Google reviews do you actually need?',
    description:
      'What the number has to beat, why a 4.7 outperforms a 5.0, and a simple way to work out your own target from the businesses already ranking above you.',
    excerpt:
      'There is no universal number, but there is a number for your street. Here is how to find it in about ten minutes.',
    category: 'growth',
    published: '2026-07-16',
    updated: '2026-11-11',
    readingMinutes: 8,
    wordCount: 1500,
    keywords: [
      'how many google reviews do i need',
      'average google reviews',
      'good google rating',
      'review benchmark local business',
      'star rating conversion',
    ],
    load: () => import('./how-many-google-reviews-do-you-need.jsx'),
  },
];

export const getPost = (slug) => POSTS.find((p) => p.slug === slug);

export const pillarPost = () => POSTS.find((p) => p.pillar) || POSTS[0];

/** Up to `limit` posts related to `slug`, preferring the same category. */
export function relatedPosts(slug, limit = 3) {
  const post = getPost(slug);
  if (!post) return POSTS.slice(0, limit);

  const sameCategory = POSTS.filter((p) => p.slug !== slug && p.category === post.category);
  const rest = POSTS.filter((p) => p.slug !== slug && p.category !== post.category);

  // The pillar is always worth surfacing from a spoke.
  const ordered = post.pillar ? [...sameCategory, ...rest] : [pillarPost(), ...sameCategory, ...rest];

  return [...new Map(ordered.filter(Boolean).map((p) => [p.slug, p])).values()].slice(0, limit);
}

export const postsByCategory = () =>
  Object.entries(CATEGORIES).map(([key, meta]) => ({
    key,
    ...meta,
    posts: POSTS.filter((p) => p.category === key),
  }));
