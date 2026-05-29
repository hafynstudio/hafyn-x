/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#EAB308',
          dark: '#0a0a0a',
          card: '#111111',
          border: '#222222',
        },
      },
      fontFamily: {
        logo: ['Rajdhani', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
