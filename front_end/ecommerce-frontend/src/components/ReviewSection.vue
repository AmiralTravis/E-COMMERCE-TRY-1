<!-- components/ReviewSection.vue -->
<template>
    <div class="space-y-8">
      <!-- Review Form -->
      <div v-if="canReview" class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-4">
          {{ userReview ? 'Edit Your Review' : 'Write a Review' }}
        </h3>
        <form @submit.prevent="handleSubmitReview" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-2">Rating</label>
            <div class="flex gap-2">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                @click="rating = star"
                class="text-2xl focus:outline-none"
                :class="star <= rating ? 'text-yellow-400' : 'text-gray-300'"
              >
                ★
              </button>
            </div>
          </div>
  
          <div>
            <label class="block text-sm font-medium mb-2">Review</label>
            <textarea
              v-model="comment"
              required
              rows="4"
              class="w-full p-2 border rounded-lg"
              placeholder="Share your experience with this product..."
            ></textarea>
          </div>
  
          <div class="flex gap-4">
            <button
              type="submit"
              :disabled="!rating || !comment"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {{ userReview ? 'Update Review' : 'Submit Review' }}
            </button>
            <button
              v-if="userReview"
              type="button"
              @click="handleDeleteReview"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Delete Review
            </button>
          </div>
        </form>
      </div>
  
      <!-- Reviews List -->
      <div v-if="reviews.length" class="space-y-6">
        <div v-for="review in reviews" :key="review.id" class="border-b pb-6">
          <div class="flex items-center gap-4 mb-2">
            <div class="text-yellow-400">
              {{ "★".repeat(review.rating) }}{{ "☆".repeat(5 - review.rating) }}
            </div>
            <span class="text-sm text-gray-600">Verified Purchase</span>
          </div>
          <p class="text-gray-900 mb-2">{{ review.comment }}</p>
          <p class="text-sm text-gray-600">
            By {{ review.User?.name || 'Anonymous' }} on {{ formatDate(review.createdAt) }}
          </p>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">
        No reviews yet. Be the first to review this product!
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useReviewStore } from '@/stores/reviewStore';
  import { useAuthStore } from '@/stores/auth';
  
  export default {
    name: 'ReviewSection',
    props: {
      productId: {
        type: [Number, String],
        required: true
      }
    },
  
    setup(props) {
      const reviewStore = useReviewStore();
      const authStore = useAuthStore();
      const rating = ref(0);
      const comment = ref('');
  
      const initializeReviews = async () => {
        await reviewStore.fetchReviews(props.productId);
  
        if (authStore.isAuthenticated) {
          await Promise.all([
            reviewStore.checkReviewEligibility(props.productId),
            reviewStore.getUserReview(props.productId)
          ]);
  
          if (reviewStore.userReview) {
            rating.value = reviewStore.userReview.rating;
            comment.value = reviewStore.userReview.comment;
          }
        }
      };
  
      onMounted(initializeReviews);
  
      const handleSubmitReview = async () => {
        if (!rating.value || !comment.value) return;
  
        try {
          if (reviewStore.userReview) {
            await reviewStore.updateReview(reviewStore.userReview.id, { rating: rating.value, comment: comment.value });
          } else {
            await reviewStore.addReview(props.productId, { rating: rating.value, comment: comment.value });
          }
          await reviewStore.fetchReviews(props.productId);
        } catch (error) {
          alert(error.message);
        }
      };
  
      const handleDeleteReview = async () => {
        if (!confirm('Are you sure you want to delete your review?')) return;
        
        try {
          await reviewStore.deleteReview(reviewStore.userReview.id);
          rating.value = 0;
          comment.value = '';
          await reviewStore.fetchReviews(props.productId);
        } catch (error) {
          alert(error.message);
        }
      };
  
      const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
      };
  
      return {
        rating,
        comment,
        reviews: computed(() => reviewStore.reviews),
        canReview: computed(() => reviewStore.canReview),
        userReview: computed(() => reviewStore.userReview),
        handleSubmitReview,
        handleDeleteReview,
        formatDate
      };
    }
  };
  </script>