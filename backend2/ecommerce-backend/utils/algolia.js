// // utils/algolia.js
// import algoliasearch from 'algoliasearch';

// const client = algoliasearch(
//   process.env.VITE_ALGOLIA_APP_ID,
//   process.env.VITE_ALGOLIA_ADMIN_KEY
// );

// const index = client.initIndex('products');

// // Function to sync products with Algolia
// export const syncProductsWithAlgolia = async (products) => {
//   const records = products.map(product => ({
//     objectID: product.id,
//     name: product.name,
//     description: product.description,
//     price: product.price,
//     categories: product.Categories?.map(cat => cat.name) || [],
//     imageUrl: product.imageUrl
//   }));

//   try {
//     await index.saveObjects(records);
//   } catch (error) {
//     console.error('Error syncing with Algolia:', error);
//     throw error;
//   }
// };

// export const searchProducts = async (query) => {
//   try {
//     const { hits } = await index.search(query);
//     return hits;
//   } catch (error) {
//     console.error('Error searching products:', error);
//     throw error;
//   }
// };

// export default index;