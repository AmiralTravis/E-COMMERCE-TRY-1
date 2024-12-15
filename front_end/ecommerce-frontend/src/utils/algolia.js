// // src/utils/algolia.js
// import * as algoliasearch from 'algoliasearch/lite';

// const client = algoliasearch(
//     import.meta.env.VITE_ALGOLIA_APP_ID,     // Note the import.meta.env
//     import.meta.env.VITE_ALGOLIA_SEARCH_KEY  // Use search key, not admin key
  
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






// // src/utils/algolia.js
// import {algoliasearch} from 'algoliasearch';
// console.log('Algolia App ID:', import.meta.env.VITE_ALGOLIA_APP_ID);

// // Create the search client
// const searchClient = algoliasearch(
//     import.meta.env.VITE_ALGOLIA_APP_ID,
//     import.meta.env.VITE_ALGOLIA_SEARCH_KEY
// );

// // Create the index
// const index = searchClient.initIndex('products');

// // Export functions
// export const searchProducts = async (query) => {
//   try {
//     const { hits } = await index.search(query);
//     return hits;
//   } catch (error) {
//     console.error('Error searching products:', error);
//     throw error;
//   }
// };

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

// export default searchClient;







// // src/utils/algolia.js
// import * as algoliasearch from 'algoliasearch';

// // Create the search client
// const searchClient = algoliasearch(
//     import.meta.env.VITE_ALGOLIA_APP_ID,
//     import.meta.env.VITE_ALGOLIA_SEARCH_KEY
// );

// // Log the search client to inspect its structure
// console.log('Search Client:', searchClient);

// // Try creating the index using the full method
// const index = searchClient.initIndex('products');

// // Alternative approach if initIndex is not working
// const searchIndex = searchClient.search('products');

// export const searchProducts = async (query) => {
//   try {
//     // Log the available methods on the search client
//     console.log('Search Client Methods:', Object.keys(searchClient));
    
//     // Try different search methods
//     const { hits } = await searchClient.search(query);
//     return hits;
//   } catch (error) {
//     console.error('Error searching products:', error);
//     throw error;
//   }
// };

// export default searchClient;