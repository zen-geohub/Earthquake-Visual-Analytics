/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/**/*.{html,js}'],
  theme: {
    extend: {
      fontFamily: {
        'Montserrat': ['Montserrat', 'Montserrat']
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}

