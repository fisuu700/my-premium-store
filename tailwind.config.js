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
        hood: {
          gold: '#FFBF00',
          amber: '#FF7E00',
          black: '#0A0A0A',
          dark: '#121212',
          gray: '#1E1E1E',
        },
      },
    },
  },
  plugins: [],
}
