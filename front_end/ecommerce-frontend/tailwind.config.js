
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF9900', // Vibrant orange for buttons and highlights
        secondary: '#232F3E', // Dark blue for headers and accents
        neutral: {
          100: '#F5F5F5', // Light gray for backgrounds
          700: '#333333', // Dark gray for text
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Modern sans-serif font
      },
      spacing: {
        72: '18rem', // Custom spacing for product cards
        80: '20rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // For form styling
  ],
};