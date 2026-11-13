/**
 * Initials avatar.
 *
 * Replaces a single cartoon portrait that was loaded from a third-party CDN and
 * shown for every user, so the admin, every staff member and every customer all
 * had the same face. Initials are honest, load instantly, and need no network.
 */
const TONES = ['bg-ink text-white', 'bg-brand-700 text-white', 'bg-pastel-sage text-ink', 'bg-pastel-lilac text-ink', 'bg-pastel-butter text-ink'];

const toneFor = (name = '') => {
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length];
};

export default function Avatar({ name = '', className = 'h-12 w-12 text-base', ring = true }) {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase() || '?';

  return (
    <span
      role="img"
      aria-label={name || 'Account'}
      className={`inline-grid shrink-0 place-items-center rounded-full font-semibold tracking-tight ${toneFor(name)} ${
        ring ? 'ring-2 ring-white shadow-sm' : ''
      } ${className}`}
    >
      {initials}
    </span>
  );
}
