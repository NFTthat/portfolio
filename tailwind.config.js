/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E2E5EB',
        black: '#000000',
        white: '#FFFFFF',
      },
      fontFamily: {
        ojuju: ['"Ojuju"', 'sans-serif'],
        sans: ['"Google Sans Flex"', 'sans-serif'],
      },
      spacing: {
        'brutalist-gap': '160px',
        'brutalist-gap-lg': '200px',
      },
    },
  },
  plugins: [],
}
