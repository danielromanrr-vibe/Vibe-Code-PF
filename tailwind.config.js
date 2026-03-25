/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#FAFAFA',
        ink: '#141414',
        accent: '#5064C8',
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'serif'],
      },
      lineHeight: {
        /* Matches --leading-body in index.css (body / caption / small-text) */
        relaxed: 'var(--leading-body)',
      },
    },
  },
  plugins: [],
}
