import { Component } from 'react';
import { Link } from 'react-router-dom';

/**
 * Catches a render error so one broken component does not blank the whole app.
 *
 * There was no boundary before, and several reachable paths could throw — an
 * unchecked `.user.isActive` on an inactive account, `.map` on a response that
 * returned an object instead of an array. The result was a white page with
 * nothing in it.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // Where a Sentry (or similar) client would go. Logged meanwhile so the
    // stack is not lost entirely.
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-5 py-16">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 ring-1 ring-ink/10">
          <p className="text-[11.5px] font-semibold uppercase tracking-wider text-ink-mute">Something broke</p>
          <h1 className="mt-2 text-2xl font-medium tracking-tight text-ink">This page did not load</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Not your fault. Reloading usually sorts it. If it keeps happening, email us and we will look at it — your
            data is unaffected.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white transition hover:bg-ink/90"
            >
              Reload the page
            </button>
            <Link
              to="/"
              onClick={this.reset}
              className="rounded-full px-5 py-2.5 text-sm font-medium text-ink ring-1 ring-ink/15 transition hover:bg-paper"
            >
              Go to the start
            </Link>
          </div>

          {import.meta.env.DEV ? (
            <pre className="mt-6 max-h-48 overflow-auto rounded-xl bg-paper p-3 font-mono text-[11px] leading-relaxed text-ink-soft">
              {error.message}
              {'\n\n'}
              {error.stack}
            </pre>
          ) : null}
        </div>
      </div>
    );
  }
}
