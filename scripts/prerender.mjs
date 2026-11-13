#!/usr/bin/env node
/**
 * Post-build: writes a per-route index.html into dist/ so every indexable page
 * ships with its own title, description, canonical, Open Graph / Twitter tags,
 * JSON-LD and a readable text fallback.
 *
 * Why: the app is a client-rendered SPA, so every URL used to serve the same
 * generic <head>. Google runs JavaScript (eventually), but link-preview
 * scrapers (WhatsApp, LinkedIn, Slack, X) and many other crawlers do not — so
 * every guide shared as a link previewed as the homepage.
 *
 * What this is not: it does not render the React tree to HTML, so the article
 * body itself is still drawn client-side. Full server rendering would need an
 * SSR build; this is the cheap step that fixes the head and gives crawlers a
 * summary and the internal links.
 *
 * Netlify serves dist/blog/<slug>/index.html for /blog/<slug> ahead of the SPA
 * fallback redirect, because a real file wins over a non-forced rewrite.
 *
 * Tags carry data-rh="true" so react-helmet-async adopts and replaces them on
 * the client instead of leaving duplicates behind.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dist = join(root, 'dist');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('prerender: dist/index.html not found — run `vite build` first.');
  process.exit(1);
}

// Both modules are plain ESM with no imports, and each post's body is a lazy
// `load()` that is never called here, so this does not pull in React.
const { POSTS } = await import(pathToFileURL(join(root, 'src/data/posts/index.js')).href);
const site = await import(pathToFileURL(join(root, 'src/data/site.js')).href);
const { SITE, PAGE_SEO, FAQ, PRICING } = site;

const template = readFileSync(join(dist, 'index.html'), 'utf8');

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const abs = (p) => `${SITE.url}${p === '/' ? '/' : p}`;
const OG_IMAGE = `${SITE.url}/og-default.png`;
const withBrand = (t) => (t.includes(SITE.name) ? t : `${t} | ${SITE.name}`);

/* ---------- JSON-LD ---------- */

const organization = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.name,
  url: SITE.url,
  logo: `${SITE.url}/logo-512.png`,
  description: SITE.description,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address.street,
    addressLocality: SITE.address.city,
    addressRegion: SITE.address.region,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.country,
  },
});

const breadcrumb = (trail) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((t, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: t.name,
    item: abs(t.path),
  })),
});

const faqLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

const articleLd = (p) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: p.title,
  description: p.description,
  datePublished: p.published,
  dateModified: p.updated || p.published,
  author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  publisher: { '@id': `${SITE.url}/#organization` },
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(`/blog/${p.slug}`) },
  keywords: p.keywords?.join(', '),
  inLanguage: 'en',
});

/* ---------- routes ---------- */

const pages = [
  {
    path: '/',
    ...PAGE_SEO.home,
    h1: 'Your best customers already like you. On Google.',
    links: [['/pricing', 'Pricing'], ['/blog', 'Guides'], ['/features', 'How it works']],
    ld: [organization(), faqLd()],
  },
  {
    path: '/pricing',
    ...PAGE_SEO.pricing,
    h1: 'Pricing',
    links: [['/register', 'Start for ₹49'], ['/blog', 'Guides']],
    ld: [
      organization(),
      faqLd(),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Pricing', path: '/pricing' }]),
    ],
  },
  {
    path: '/blog',
    ...PAGE_SEO.blog,
    h1: 'Everything we know about getting Google reviews',
    links: POSTS.map((p) => [`/blog/${p.slug}`, p.title]),
    ld: [
      organization(),
      breadcrumb([{ name: 'Home', path: '/' }, { name: 'Guides', path: '/blog' }]),
    ],
  },
  { path: '/features', ...PAGE_SEO.features, h1: 'How LogicQR works', links: [['/pricing', 'Pricing']], ld: [organization()] },
  { path: '/docs', ...PAGE_SEO.docs, h1: 'Setup guide', links: [['/register', 'Get started']], ld: [organization()] },
  { path: '/terms-condition', ...PAGE_SEO.terms, h1: 'Terms and privacy', links: [], ld: [] },

  ...POSTS.map((p) => ({
    path: `/blog/${p.slug}`,
    title: p.title,
    description: p.description,
    type: 'article',
    published: p.published,
    updated: p.updated || p.published,
    keywords: p.keywords?.join(', '),
    h1: p.title,
    extra: p.excerpt,
    links: [
      ['/blog', 'All guides'],
      ['/pricing', 'Pricing'],
      ['/register', 'Start for ₹49'],
    ],
    ld: [
      organization(),
      articleLd(p),
      breadcrumb([
        { name: 'Home', path: '/' },
        { name: 'Guides', path: '/blog' },
        { name: p.title, path: `/blog/${p.slug}` },
      ]),
    ],
  })),
];

/* ---------- head construction ---------- */

function headTags(page) {
  const title = withBrand(page.title);
  const url = abs(page.path);
  const type = page.type || 'website';

  const t = [
    `<title>${esc(title)}</title>`,
    `<meta data-rh="true" name="description" content="${esc(page.description)}" />`,
    `<link data-rh="true" rel="canonical" href="${esc(url)}" />`,
    page.keywords ? `<meta data-rh="true" name="keywords" content="${esc(page.keywords)}" />` : '',
    `<meta data-rh="true" name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />`,

    `<meta data-rh="true" property="og:type" content="${type}" />`,
    `<meta data-rh="true" property="og:site_name" content="${esc(SITE.name)}" />`,
    `<meta data-rh="true" property="og:title" content="${esc(title)}" />`,
    `<meta data-rh="true" property="og:description" content="${esc(page.description)}" />`,
    `<meta data-rh="true" property="og:url" content="${esc(url)}" />`,
    `<meta data-rh="true" property="og:image" content="${OG_IMAGE}" />`,
    `<meta data-rh="true" property="og:image:width" content="1200" />`,
    `<meta data-rh="true" property="og:image:height" content="630" />`,
    `<meta data-rh="true" property="og:locale" content="en_IN" />`,

    `<meta data-rh="true" name="twitter:card" content="summary_large_image" />`,
    `<meta data-rh="true" name="twitter:title" content="${esc(title)}" />`,
    `<meta data-rh="true" name="twitter:description" content="${esc(page.description)}" />`,
    `<meta data-rh="true" name="twitter:image" content="${OG_IMAGE}" />`,

    page.published ? `<meta data-rh="true" property="article:published_time" content="${page.published}" />` : '',
    page.updated ? `<meta data-rh="true" property="article:modified_time" content="${page.updated}" />` : '',
  ];

  if (page.ld?.length) {
    // `<` escaped so a title can never close the script tag.
    const json = JSON.stringify(page.ld).replace(/</g, '\\u003c');
    t.push(`<script data-rh="true" type="application/ld+json">${json}</script>`);
  }

  return t.filter(Boolean).join('\n    ');
}

/** Readable summary inside #root; React replaces it the moment it mounts. */
function fallbackBody(page) {
  const nav = (page.links || [])
    .map(([href, label]) => `<li><a href="${esc(href)}">${esc(label)}</a></li>`)
    .join('');

  return `<main style="max-width:44rem;margin:12vh auto;padding:0 1.5rem;font-family:system-ui,sans-serif;color:#121417">
      <p style="font-size:.8rem;letter-spacing:.08em;text-transform:uppercase;color:#6f6d67">${esc(SITE.name)}</p>
      <h1 style="font-size:2rem;letter-spacing:-.03em;line-height:1.1;margin:.4rem 0 1rem">${esc(page.h1 || page.title)}</h1>
      <p style="font-size:1.1rem;line-height:1.55;color:#4a4944">${esc(page.description)}</p>
      ${page.extra ? `<p style="line-height:1.6;color:#4a4944">${esc(page.extra)}</p>` : ''}
      ${nav ? `<ul style="line-height:2">${nav}</ul>` : ''}
    </main>`;
}

function render(page) {
  let html = template;

  // Drop the generic head tags the template ships with; this page replaces them.
  html = html
    .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
    .replace(/<meta\s+name="description"[^>]*>\s*/i, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/i, '')
    .replace(/<meta\s+property="og:[^"]+"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="twitter:[^"]+"[^>]*>\s*/gi, '');

  html = html.replace('</head>', `    ${headTags(page)}\n  </head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${fallbackBody(page)}</div>`);
  return html;
}

/* ---------- write ---------- */

let written = 0;
for (const page of pages) {
  const html = render(page);

  if (page.path === '/') {
    writeFileSync(join(dist, 'index.html'), html, 'utf8');
  } else {
    const dir = join(dist, page.path.replace(/^\//, ''));
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html, 'utf8');
  }
  written += 1;
}

console.log(`prerender: wrote ${written} pages (${POSTS.length} guides)`);
