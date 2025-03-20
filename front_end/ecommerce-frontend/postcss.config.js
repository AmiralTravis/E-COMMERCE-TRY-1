// // /ecommerce-frontend/postcss.config.js

// module.exports = {
//   plugins: {
//     'postcss-import': {},
//     '@tailwindcss/postcss': {},
//     autoprefixer: {},
//   }
// };

module.exports = {
  plugins: {
    tailwindcss: {}, // Important: changed from '@tailwindcss/postcss' to 'tailwindcss'
    autoprefixer: {},
  },
};