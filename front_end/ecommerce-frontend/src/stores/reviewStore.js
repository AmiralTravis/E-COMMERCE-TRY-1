// stores/reviewStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: [],
    userReview: null,
    loading: false,
    error: null,
    canReview: false,
    debugInfo: null  // Add this to store debugging info
  }),

  actions: {
    async checkReviewEligibility(productId) {
      try {
        console.log('Checking eligibility for product:', productId);
        const response = await axios.get(`/api/verified-purchases/check/${productId}`);
        console.log('Eligibility response:', response.data);
        
        // Store the full response for debugging
        this.debugInfo = response.data;
        
        // Make sure we're explicitly checking for boolean value
        this.canReview = response.data.canReview === true;
        
        // Log the final state
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

    // async fetchReviews(productId) {
    //     this.loading = true;
    //     try {
    //       const response = await axios.get(`/api/reviews/${productId}`);
    //       this.reviews = response.data;
    //       console.log('Fetched reviews:', this.reviews);
    //     } catch (error) {
    //       console.error('Error fetching reviews:', error);
    //       this.error = error.message;
    //     } finally {
    //       this.loading = false;
    //     }
    //   },
    async fetchReviews(productId) {
      this.loading = true;
      try {
        const response = await axios.get(`/api/reviews/${productId}`);
        this.reviews = response.data;
        console.log('Fetched reviews:', this.reviews); // Log the response
      } catch (error) {
        console.error('Error fetching reviews:', error);
        this.error = error.message;
      } finally {
        this.loading = false;
      }
    },

    async addReview(productId, review) {
      try {
        const response = await axios.post(`/api/reviews/${productId}`, {
          ...review,
          userId: this.getUserId() // Get from auth store
        });
        this.reviews.unshift(response.data);
        this.userReview = response.data;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add review');
      }
    },

    getUserId() {
      const authStore = useAuthStore();
      return authStore.user?.id;
    },

    async updateReview(reviewId, review) {
      try {
        const response = await axios.put(`/api/reviews/${reviewId}`, review);
        const index = this.reviews.findIndex(r => r.id === reviewId);
        if (index !== -1) {
          this.reviews[index] = response.data;
          this.userReview = response.data;
        }
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to update review');
      }
    },

    async deleteReview(reviewId) {
      try {
        await axios.delete(`/api/reviews/${reviewId}`);
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.userReview = null;
      } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to delete review');
      }
    },

    async getUserReview(productId) {
        try {
          console.log('Fetching user review for product:', productId);
          const response = await axios.get(`/api/reviews/${productId}/user-review`);
          this.userReview = response.data;
          console.log('User review:', this.userReview);
          return response.data;
        } catch (error) {
          console.error('Error fetching user review:', error);
          this.userReview = null;
          return null;
        }
      }
  }
});