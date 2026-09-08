/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#F8F9FA',
        /** Pure white for cards / surfaces on gray page */
        card: '#FFFFFF',
        /** Primary text ink — near-black */
        ink: '#141414',
        'navy-deep': '#0c1528',
        accent: '#5064C8',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Manrope', 'sans-serif'],
        body: ['var(--font-body)', 'Manrope', 'sans-serif'],
        eyebrow: ['var(--font-eyebrow)', 'Port Lligat Slab', 'ui-serif', 'Georgia', 'serif'],
        hero: ['var(--font-hero-display)', 'Port Lligat Slab', 'ui-serif', 'Georgia', 'serif'],
      },
      fontSize: {
        /** Canonical narrative body — 14px on every breakpoint */
        body: ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
        h1: ['var(--text-h1)', { lineHeight: 'var(--leading-h1)' }],
        h2: ['var(--text-h2)', { lineHeight: 'var(--leading-h2)' }],
        h3: ['var(--text-h3)', { lineHeight: 'var(--leading-h3)' }],
        eyebrow: ['var(--text-slab-eyebrow)', { lineHeight: 'var(--leading-eyebrow)' }],
      },
      maxWidth: {
        /** Primary reading measure (52–60ch) */
        measure: '60ch',
        /** Hero / summaries / tight blocks */
        'measure-tight': '45ch',
      },
      lineHeight: {
        /* Matches --leading-body in index.css */
        relaxed: 'var(--leading-body)',
      },
    },
  },
  plugins: [],
}
