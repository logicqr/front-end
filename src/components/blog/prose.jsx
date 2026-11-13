import { Link } from 'react-router-dom';

/**
 * Prose building blocks shared by the guides, so every article is marked up the
 * same way and the styling in marketing.css has one set of shapes to target.
 */

/** A table that scrolls sideways on a phone instead of widening the page. */
export function Table({ head, rows, caption }) {
  return (
    <figure style={{ background: 'none', boxShadow: 'none', padding: 0 }}>
      <div className="tablewrap">
        <table>
          <thead>
            <tr>
              {head.map((h) => (
                <th key={h} scope="col">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {caption ? (
        <figcaption className="fine" style={{ marginTop: 10 }}>
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** A boxed aside: a warning, a worked example, a rule of thumb. */
export function Note({ kind = 'info', title, children }) {
  return (
    <figure className={`note-box note-${kind}`}>
      {title ? <b>{title}</b> : null}
      {children}
    </figure>
  );
}

/** A numbered procedure. Rendered as an ordered list so it reads as one. */
export function Steps({ items }) {
  return (
    <ol className="steps-list">
      {items.map((item, i) => (
        <li key={i}>
          {item.name ? <b>{item.name}</b> : null}
          <span>{item.text}</span>
        </li>
      ))}
    </ol>
  );
}

/** A script someone can read out or paste. Monospaced, copyable, quoted. */
export function Script({ label, children }) {
  return (
    <figure className="script-box">
      {label ? <b>{label}</b> : null}
      <p>{children}</p>
    </figure>
  );
}

/** An internal link to another guide, styled so it reads as a pointer. */
export function Guide({ to, children }) {
  return (
    <Link className="guide-link" to={`/blog/${to}`}>
      {children}
      <span aria-hidden="true"> →</span>
    </Link>
  );
}

/** Two-column do / don't comparison. */
export function DoDont({ doTitle = 'Do this', dontTitle = 'Not this', doItems, dontItems }) {
  return (
    <figure className="dodont">
      <div className="dd-col dd-do">
        <b>{doTitle}</b>
        <ul>
          {doItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <div className="dd-col dd-dont">
        <b>{dontTitle}</b>
        <ul>
          {dontItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </figure>
  );
}

/** Jump links, built from the article's own h2 list. */
export function Toc({ items }) {
  return (
    <nav className="toc" aria-label="On this page">
      <b>On this page</b>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`}>{item.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** An h2 with a stable id, so the table of contents and deep links both work. */
export function H2({ id, children }) {
  return <h2 id={id}>{children}</h2>;
}

export function H3({ id, children }) {
  return <h3 id={id}>{children}</h3>;
}
