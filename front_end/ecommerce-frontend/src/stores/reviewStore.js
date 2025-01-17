// // stores/reviewStore.js

import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// Add an Axios interceptor to include the token in authenticated requests
axios.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.token; // Retrieve the token from the auth store

  // Only add the token if the request is not a public route
  const isPublicRoute = [
    '/api/reviews/:productId', // Fetch reviews (public)
    '/api/products/:id',       // Fetch product details (public)
  ].some((path) => {
    const regex = new RegExp(`^${path.replace(/:\w+/g, '[^/]+')}$`);
    return regex.test(config.url);
  });

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: [],
    userReview: null,
    loading: false,
    error: null,
    canReview: false,
    debugInfo: null, // Add this to store debugging info
  }),

  actions: {
    // Public action: Fetch reviews for a product (no token required)
    async fetchReviews(productId) {
      this.loading = true;
      try {
        const response = await axios.get(`/api/reviews/${productId}`);
        this.reviews = response.data;
      } catch (error) {
        console.error('Error fetching reviews:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    // Public action: Check review eligibility (no token required)
    async checkReviewEligibility(productId) {
      try {
        console.log('Checking eligibility for product:', productId);
        const response = await axios.get(`/api/verified-purchases/check/${productId}`);
        console.log('Eligibility response:', response.data);

        this.debugInfo = response.data;
        this.canReview = response.data.canReview === true;
        console.log('canReview set to:', this.canReview);

        return this.canReview;
      } catch (error) {
        console.error('Error checking review eligibility:', error);
        console.log('Error response:', error.response?.data);
        this.canReview = false;
        this.error = error.message;
        return false;
      }
    },

    // Authenticated action: Add a review (requires token)
    async addReview(productId, review) {
      try {
        console.log('Adding review for product:', productId);
        console.log('Review data:', review);

        const response = await axios.post(`/api/reviews/${productId}`, {
          ...review,
          userId: this.getUserId(), // Get from auth store
        });

        console.log('Review added successfully:', response.data);

        // Update the reviews list
        this.reviews.unshift(response.data);

        // Update the userReview state
        this.userReview = response.data;
        console.log('userReview updated:', this.userReview);
      } catch (error) {
        console.error('Failed to add review:', error);
        throw new Error(error.response?.data?.error || 'Failed to add review');
      }
    },

    // Helper function to get the user ID from the auth store
    getUserId() {
      const authStore = useAuthStore();
      return authStore.user?.id;
    },

    // Authenticated action: Update a review (requires token)
    async updateReview(reviewId, review) {
      try {
        const response = await axios.put(`/api/reviews/${reviewId}`, review);
        const index = this.reviews.findIndex((r) => r.id === reviewId);
        if (index !== -1) {
          this.reviews[index] = response.data;
          this.userReview = response.data;
        }
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update review');
      }
    },

    // Authenticated action: Delete a review (requires token)
    async deleteReview(reviewId) {
      try {
        await axios.delete(`/api/reviews/${reviewId}`);
        this.reviews = this.reviews.filter((r) => r.id !== reviewId);
        this.userReview = null;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete review');
      }
    },

    // Authenticated action: Fetch the user's review for a product (requires token)
    async getUserReview(productId) {
      try {
        const response = await axios.get(`/api/reviews/${productId}/user-review`);
        this.userReview = response.data;
      } catch (error) {
        if (error.response?.status === 401) {
          // User is not logged in, so no user review exists
          this.userReview = null;
        } else {
          console.error('Error fetching user review:', error);
          this.userReview = null;
        }
      }
    },
  },
});