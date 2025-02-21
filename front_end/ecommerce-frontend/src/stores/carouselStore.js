// // stores/carouselStore.js
// import { defineStore } from 'pinia'

// export const useCarouselStore = defineStore('carousel', {
//   state: () => ({
//     isAutoScrolling: true,
//     scrollDirection: 1, // 1 for right, -1 for left
//     pauseTimeout: null,
//   }),
//   actions: {
//     pauseAutoScroll() {
//       this.isAutoScrolling = false
//       if (this.pauseTimeout) {
//         clearTimeout(this.pauseTimeout)
//       }
//       this.pauseTimeout = setTimeout(() => {
//         this.isAutoScrolling = true
//       }, 3000)
//     },
//   },
// })