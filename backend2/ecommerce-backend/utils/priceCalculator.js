// // utils/priceCalculator.js
// export const calculateDiscountedPrice = (product) => {
//     if (product.discountCategory === 'none') {
//       return product.price
//     }
  
//     let discount = product.discountPercentage
//     if (product.discountCategory === 'flat_50') {
//       discount = 50
//     } else if (product.discountCategory === 'upto_75') {
//       discount = Math.min(discount, 75)
//     } else if (product.discountCategory === 'upto_40') {
//       discount = Math.min(discount, 40)
//     }
  
//     return product.price * (1 - discount / 100)
//   }
  
//   export const getDiscountCategory = (discountPercentage) => {
//     if (discountPercentage === 50) return 'flat_50'
//     if (discountPercentage > 40 && discountPercentage <= 75) return 'upto_75'
//     if (discountPercentage > 0 && discountPercentage <= 40) return 'upto_40'
//     return 'none'
//   }