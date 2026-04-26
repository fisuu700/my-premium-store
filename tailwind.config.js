/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#ced9fd',
          300: '#a1b6fb',
          400: '#6d8df7',
          500: '#3b5ff2',
          600: '#2541e8',
          700: '#1d31d4',
          800: '#1d29ad',
          900: '#1d2789',
          950: '#121754',
        },
      },
    },
  },
  plugins: [],
}
