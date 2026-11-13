/** @type {import('tailwindcss').Config} */

/**
 * The dashboard stays on Tailwind; the marketing site uses the plain-CSS system
 * in src/styles. Both draw the same palette, so `bg-ink` here and `var(--ink)`
 * there are the same colour.
 *
 * This is what replaced 56 loose hex literals scattered through the JSX —
 * `#032068` alone appeared 46 times, which made a brand change a find-and-replace.
 */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F3F2EE',
        card: '#FBFAF8',
        ink: {
          DEFAULT: '#121417',
          soft: '#4A4944',
          mute: '#6F6D67',
        },
        brand: {
          50: '#F2FBFC',
          100: '#DDF4F7',
          200: '#BCE9EF',
          300: '#8EE6F2',
          400: '#4FDCEC',
          500: '#13B8CF',
          600: '#0E9CB0',
          700: '#087889',
          800: '#0A6271',
          900: '#0D5260',
        },
        signal: {
          live: '#1F8A4C',
          'live-soft': '#E5F4E8',
          warn: '#FF6A3D',
          'warn-soft': '#FFE9E1',
        },
        pastel: {
          sage: '#DCE7D6',
          butter: '#F2E8C4',
          lilac: '#E2DFF3',
          blush: '#F4DCD6',
          sky: '#D9E5F1',
          lime: '#D4F36B',
          pink: '#FFB4D2',
          orange: '#FFB15C',
          violet: '#C9B8FF',
          yellow: '#FFE36B',
          blue: '#9EC1FF',
        },

        /**
         * Tailwind's own `gray`, `blue` and `purple` scales, remapped.
         *
         * The product screens were written against those three scales plus a
         * navy hex (#032068). Overriding them here restyles every one of those
         * screens to the LogicQR palette without editing each class:
         *
         *   gray    → warm neutrals that sit on the paper ground
         *   blue    → the cyan accent for 50–700 (tints, links, icons), and ink
         *             for 800–950 (headings, solid surfaces)
         *   purple  → folded into the same accent, since the product has one
         *             accent colour, not two
         *
         * Status colours (red, green, yellow) are left alone on purpose: those
         * carry meaning.
         */
        gray: {
          50: '#F8F7F3',
          100: '#F3F2EE',
          200: '#E7E4DD',
          300: '#D6D3CC',
          400: '#A9A69F',
          500: '#6F6D67',
          600: '#4A4944',
          700: '#3A3936',
          800: '#26272A',
          900: '#121417',
          950: '#0B0C0E',
        },
        blue: {
          50: '#F2FBFC',
          100: '#DDF4F7',
          200: '#BCE9EF',
          300: '#8EE6F2',
          400: '#4FDCEC',
          500: '#0E9CB0',
          600: '#087889',
          700: '#0A6271',
          800: '#1D2025',
          900: '#121417',
          950: '#121417',
        },
        purple: {
          50: '#F2FBFC',
          100: '#DDF4F7',
          200: '#BCE9EF',
          300: '#8EE6F2',
          400: '#4FDCEC',
          500: '#0E9CB0',
          600: '#087889',
          700: '#0A6271',
          800: '#1D2025',
          900: '#121417',
        },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
        serif: ['Roboto Serif Variable', 'Roboto Serif', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        card: '22px',
        panel: '32px',
      },
      boxShadow: {
        card: '0 1px 0 rgba(255,255,255,.8) inset, 0 0 0 1px rgba(18,20,23,.07), 0 30px 60px -30px rgba(18,20,23,.25)',
        lift: '0 26px 44px -30px rgba(18,20,23,.32)',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(.16,1,.3,1)',
      },
      letterSpacing: {
        display: '-0.045em',
      },
    },
  },
  plugins: [],
};
