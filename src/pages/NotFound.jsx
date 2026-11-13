import { Link } from 'react-router-dom';
import Seo from '../components/common/Seo';
import { Pill } from '../components/marketing/ui';
import { POSTS } from '../data/posts';
import { FIRST_MONTH } from '../data/site';

/**
 * The real 404.
 *
 * There was no `path="*"` route before, so a typo'd URL rendered a blank white
 * page — while a hand-built "404 Page Not Found" screen was being shown to
 * customers whose subscription had lapsed, which is the one place it should
 * never have appeared.
 */
export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found"
        description="That page does not exist. Here is the way back."
        path="/404"
        noindex
      />

      <section className="hero">
        <div className="wrap">
          <p className="kicker">404</p>
          <h1 className="display md" style={{ maxWidth: '20ch' }}>
            That page is not here.
          </h1>
          <p className="lede" style={{ marginTop: 22, maxWidth: '44ch' }}>
            It may have moved, or the link may have a typo in it. Nothing is broken on your account.
          </p>

          <div className="cta" style={{ marginTop: 30 }}>
            <Pill to="/" event="cta_404_home">
              Back to the start
            </Pill>
            <Link className="tlink" to="/blog">
              Read the guides
            </Link>
          </div>

          <div className="related" style={{ marginLeft: 0, marginTop: 56, maxWidth: 620 }}>
            <b>Popular pages</b>
            <Link to="/pricing">
              Pricing<span>{FIRST_MONTH} first month</span>
            </Link>
            {POSTS.slice(0, 3).map((p) => (
              <Link key={p.slug} to={`/blog/${p.slug}`}>
                {p.title}
                <span>{p.readingMinutes} min</span>
              </Link>
            ))}
            <Link to="/login">
              Sign in<span>Existing customers</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
