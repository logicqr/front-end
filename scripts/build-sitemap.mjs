#!/usr/bin/env node
/**
 * Generates public/sitemap.xml from the routes and the blog registry.
 *
 * Written rather than hand-maintained because the previous sitemap had drifted:
 * it listed `logicqr.com` while every canonical tag said `www.logicqr.com`,
 * which splits the ranking signal between two hosts, and it had no entry for
 * any guide.
 *
 *   npm run sitemap     (also runs as part of `npm run build`)
 */

import { writeFileSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HOST = 'https://www.logicqr.com';
const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');

/** Static routes worth indexing, with how often they change. */
const PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/pricing', priority: '0.9', changefreq: 'monthly' },
  { path: '/features', priority: '0.8', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'weekly' },
  { path: '/docs', priority: '0.7', changefreq: 'monthly' },
  { path: '/register', priority: '0.7', changefreq: 'monthly' },
  { path: '/login', priority: '0.4', changefreq: 'yearly' },
  { path: '/terms-condition', priority: '0.3', changefreq: 'yearly' },
];

/**
 * The post registry is an ES module with a dynamic `load` per entry, so
 * importing it here would pull in React. The slugs and dates are read out of
 * the source instead — ugly, but it keeps the build script dependency-free.
 */
function readPosts() {
  const src = readFileSync(join(root, 'src/data/posts/index.js'), 'utf8');
  const posts = [];

  // Each entry starts with its slug; the fields that follow belong to it until
  // the next slug appears.
  const matches = [...src.matchAll(/slug:\s*'([^']+)'/g)];

  for (let i = 0; i < matches.length; i += 1) {
    const slug = matches[i][1];
    const from = matches[i].index;
    const to = i + 1 < matches.length ? matches[i + 1].index : src.length;
    const block = src.slice(from, to);

    const published = block.match(/published:\s*'([^']+)'/)?.[1];
    const updated = block.match(/updated:\s*'([^']+)'/)?.[1];
    const pillar = /pillar:\s*true/.test(block);

    posts.push({ slug, lastmod: updated || published, pillar });
  }

  return posts;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function entry({ path, lastmod, priority, changefreq }) {
  return [
    '  <url>',
    `    <loc>${esc(HOST + path)}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    changefreq ? `    <changefreq>${changefreq}</changefreq>` : null,
    `    <priority>${priority}</priority>`,
    '  </url>',
  ]
    .filter(Boolean)
    .join('\n');
}

const today = new Date().toISOString().slice(0, 10);
const posts = readPosts();

const urls = [
  ...PAGES.map((p) => entry({ ...p, lastmod: today })),
  ...posts.map((p) =>
    entry({
      path: `/blog/${p.slug}`,
      lastmod: p.lastmod,
      // The pillar is the page to rank for the head term.
      priority: p.pillar ? '0.9' : '0.7',
      changefreq: 'monthly',
    })
  ),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`;

writeFileSync(join(root, 'public/sitemap.xml'), xml, 'utf8');
console.log(`sitemap.xml written — ${PAGES.length} pages, ${posts.length} guides`);
