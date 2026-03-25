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
        'featured-tab': ['var(--font-featured-tab)', 'sans-serif'],
        body: ['var(--font-body)', 'serif'],
      },
      lineHeight: {
        relaxed: '1.45',
      },
    },
  },
  plugins: [],
}
