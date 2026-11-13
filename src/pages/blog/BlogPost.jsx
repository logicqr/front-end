import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import Seo, { articleSchema, breadcrumbSchema, organizationSchema } from '../../components/common/Seo';
import { Pill } from '../../components/marketing/ui';
import { getPost, relatedPosts, CATEGORIES } from '../../data/posts';
import { FIRST_MONTH, MONTHLY, SITE } from '../../data/site';
import { trackClick, trackVisible } from '../../lib/tracking';

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

/** Each article is its own chunk, so the index does not ship every body. */
const bodyCache = new Map();
function articleBody(post) {
  if (!bodyCache.has(post.slug)) {
    bodyCache.set(
      post.slug,
      lazy(() => post.load())
    );
  }
  return bodyCache.get(post.slug);
}

function Loading() {
  return (
    <div className="prose" aria-busy="true">
      <p style={{ color: 'var(--mute)' }}>Loading the guide…</p>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams();
  const post = getPost(slug);
  const bodyRef = useRef(null);
  const [readMarked, setReadMarked] = useState(false);

  // "Opened" and "read" are different things worth counting separately.
  useEffect(() => {
    if (!post) return undefined;
    trackClick('blog_post_opened', { slug: post.slug, category: post.category });
    return undefined;
  }, [post]);

  useEffect(() => {
    if (!post || !bodyRef.current || readMarked) return undefined;

    // Fires once the end of the article has been on screen for a few seconds.
    const sentinel = bodyRef.current.querySelector('.read-sentinel');
    if (!sentinel) return undefined;

    const stop = trackVisible(
      sentinel,
      'blog_post_read',
      { slug: post.slug, minutes: post.readingMinutes },
      { threshold: 0.6, dwellMs: 2500 }
    );
    setReadMarked(true);
    return stop;
  }, [post, readMarked]);

  if (!post) return <Navigate to="/blog" replace />;

  const Body = articleBody(post);
  const category = CATEGORIES[post.category];
  const related = relatedPosts(post.slug, 3);

  return (
    <>
      <Seo
        title={post.title}
        description={post.description}
        path={`/blog/${post.slug}`}
        type="article"
        publishedTime={post.published}
        modifiedTime={post.updated || post.published}
        author={SITE.name}
        keywords={post.keywords?.join(', ')}
        jsonLd={[
          organizationSchema(),
          articleSchema(post),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/blog' },
            { name: post.title, path: `/blog/${post.slug}` },
          ]),
        ]}
      />

      <article className="article">
        <div className="wrap">
          <header className="article-head">
            <p className="post-meta">
              <Link to="/blog" style={{ color: 'var(--acc-ink)' }}>
                Guides
              </Link>
              <span aria-hidden="true">·</span>
              <span>{category?.label}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readingMinutes} min read</span>
            </p>

            <h1>{post.title}</h1>
            <p className="lede">{post.description}</p>

            <p className="fine" style={{ marginTop: 18 }}>
              Published {fmtDate(post.published)}
              {post.updated && post.updated !== post.published ? <> · Updated {fmtDate(post.updated)}</> : null}
            </p>
          </header>

          <div className="prose" ref={bodyRef}>
            <Suspense fallback={<Loading />}>
              <Body />
            </Suspense>
            <div className="read-sentinel" aria-hidden="true" style={{ height: 1 }} />
          </div>

          <aside className="article-cta">
            <h2>
              Put this into practice in about an hour
            </h2>
            <p>
              LogicQR gives you the review link, the printable QR card, and the private feedback box — all set up for
              your business. {FIRST_MONTH} for the first month, then {MONTHLY} a month. Cancel in one click.
            </p>
            <Pill
              variant="light"
              to="/register"
              event="cta_blog_article_start"
              eventMeta={{ slug: post.slug }}
            >
              Start for {FIRST_MONTH}
            </Pill>
          </aside>

          {related.length ? (
            <nav className="related" aria-label="Related guides">
              <b>Read next</b>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  to={`/blog/${r.slug}`}
                  onClick={() => trackClick('blog_related_opened', { from: post.slug, to: r.slug })}
                >
                  {r.title}
                  <span>{r.readingMinutes} min</span>
                </Link>
              ))}
            </nav>
          ) : null}
        </div>
      </article>
    </>
  );
}
