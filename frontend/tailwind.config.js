/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-slate-100', 'text-slate-600', 'ring-slate-200', 'bg-slate-400',
    'bg-amber-50', 'text-amber-700', 'ring-amber-100', 'bg-amber-500',
    'bg-orange-50', 'text-orange-700', 'ring-orange-100', 'bg-orange-500',
    'bg-red-50', 'text-red-700', 'ring-red-100', 'bg-red-500',
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
