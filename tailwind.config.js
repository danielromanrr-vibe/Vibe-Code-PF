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
        ink: '#141414',
        accent: '#5064C8',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'serif'],
      },
      fontSize: {
        /** Canonical narrative body — matches --text-body */
        body: ['var(--text-body)', { lineHeight: 'var(--leading-body)' }],
      },
      maxWidth: {
        /** Primary reading measure (52–60ch) */
        measure: '60ch',
        /** Hero / summaries / tight blocks */
        'measure-tight': '45ch',
      },
      lineHeight: {
        /* Matches --leading-body in index.css (body / caption / small-text) */
        relaxed: 'var(--leading-body)',
      },
    },
  },
  plugins: [],
}
