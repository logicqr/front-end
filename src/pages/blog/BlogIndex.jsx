import { Link } from 'react-router-dom';
import Seo, { breadcrumbSchema, organizationSchema } from '../../components/common/Seo';
import { Pill, Eyebrow } from '../../components/marketing/ui';
import { POSTS, CATEGORIES, pillarPost } from '../../data/posts';
import { PAGE_SEO, FIRST_MONTH, SITE } from '../../data/site';
import { trackClick } from '../../lib/tracking';

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

function PostCard({ post, feature = false }) {
  const category = CATEGORIES[post.category];

  return (
    <Link
      to={`/blog/${post.slug}`}
      className={`post-card${feature ? ' feature' : ''}`}
      onClick={() => trackClick('blog_card_opened', { slug: post.slug, feature })}
    >
      <p className="post-meta">
        <span>{category?.label}</span>
        <span aria-hidden="true">·</span>
        <span>{post.readingMinutes} min read</span>
        {feature ? (
          <>
            <span aria-hidden="true">·</span>
            <span>Start here</span>
          </>
        ) : null}
      </p>

      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>

      <span className="more">
        Read the guide <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}

export default function BlogIndex() {
  const pillar = pillarPost();
  const rest = POSTS.filter((p) => p.slug !== pillar.slug);

  const listSchema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE.url}/blog#blog`,
    name: `${SITE.name} guides`,
    description: PAGE_SEO.blog.description,
    publisher: { '@id': `${SITE.url}/#organization` },
    blogPost: POSTS.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.published,
      dateModified: p.updated || p.published,
      url: `${SITE.url}/blog/${p.slug}`,
    })),
  };

  return (
    <>
      <Seo
        {...PAGE_SEO.blog}
        keywords="google reviews guide, get more google reviews, review qr code, google review link, review gating, local seo"
        jsonLd={[
          organizationSchema(),
          listSchema,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Guides', path: '/blog' },
          ]),
        ]}
      />

      <section className="blog-hero">
        <div className="wrap">
          <Eyebrow>Free, no email required</Eyebrow>
          <h1 className="display xl" style={{ marginTop: 26, maxWidth: '18ch' }}>
            Everything we know about <em>getting reviews.</em>
          </h1>
          <p className="lede" style={{ marginTop: 24, maxWidth: '52ch' }}>
            Written for people running the business, not running a marketing department. No gated PDFs, no
            &ldquo;ultimate&rdquo; anything, and we tell you where our own product breaks the rules.
          </p>
        </div>
      </section>

      <div className="wrap">
        <div className="posts">
          <PostCard post={pillar} feature />
          {rest.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>

      <section className="dark" style={{ borderRadius: '40px 40px 0 0', padding: 'clamp(64px,8vw,110px) 0' }}>
        <div className="wrap center">
          <h2 className="display md" style={{ maxWidth: '24ch', margin: '0 auto 20px' }}>
            Or skip the reading and <em>put a code on the counter.</em>
          </h2>
          <p className="sec-p light" style={{ margin: '0 auto 32px', maxWidth: '46ch' }}>
            That is tactic number one in every guide above. We will have it printed and ready for you in an hour.
          </p>
          <div className="cta center">
            <Pill variant="light lg" to="/register" event="cta_blog_index_start">
              Start for {FIRST_MONTH}
            </Pill>
          </div>
        </div>
      </section>
    </>
  );
}
