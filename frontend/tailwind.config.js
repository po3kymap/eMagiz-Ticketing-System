/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,vue,html}',
  ],
  theme: {
    extend: {
      colors: {
        ruby: {
          50: '#fdf2f5',
          100: '#fbe3e9',
          200: '#f7c8d4',
          300: '#f19db3',
          400: '#e86689',
          500: '#d93160',
          600: '#c21b46',
          700: '#a41237',
          800: '#881331',
          900: '#72142d',
          950: '#400715',
        },
      },
    },
  },
  plugins: [],
}
