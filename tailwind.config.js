/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lavender': '#E6E6FA',
        'pastel-blue': '#B0C4DE',
        'primary': '#8A2BE2',
        'secondary': '#6495ED',
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
} 