<template>
  <div v-if="product" class="max-w-7xl mx-auto px-4 py-8">
    <!-- Product Gallery and Info Container -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Product Gallery -->
      <div class="relative">
        <div 
          class="relative h-[500px] border rounded-lg overflow-hidden"
          @mousemove="handleZoom"
          @mouseleave="isZoomed = false"
        >
          <img 
            :src="selectedImage || product.imageUrl" 
            :alt="product.name"
            class="w-full h-full object-contain"
            ref="mainImage"
            :style="zoomStyle"
          />
        </div>

        <div class="mt-4 grid grid-cols-4 gap-4">
          <div 
            v-for="(image, index) in productImages" 
            :key="index"
            class="h-24 border rounded-lg overflow-hidden cursor-pointer hover:border-blue-500"
            :class="{ 'border-blue-500': selectedImage === image }"
            @click="selectedImage = image"
          >
            <img :src="image" :alt="`${product.name} view ${index + 1}`" class="w-full h-full object-cover" />
          </div>
        </div>
      </div>

      <!-- Product Info -->
      <div class="space-y-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">{{ product.name }}</h1>
          <div class="mt-2 flex items-center gap-2">
            <!-- Partial Star Rating -->
            <div class="flex items-center">
              <div class="text-yellow-400 text-xl">
                <span v-for="star in 5" :key="star">
                  <span v-if="star <= Math.floor(averageRating)" class="full-star">★</span>
                  <span v-else-if="star === Math.ceil(averageRating) && averageRating % 1 !== 0" class="partial-star">
                    <span class="half-filled">★</span>
                    <span class="half-empty">☆</span>
                  </span>
                  <span v-else class="empty-star">☆</span>
                </span>
              </div>
              <span class="ml-2 text-sm text-gray-600">({{ averageRating.toFixed(1) }} average)</span>
            </div>
            <span class="text-sm text-gray-500">|</span>
            <span class="text-sm text-gray-600">{{ totalReviews }} reviews</span>
          </div>
        </div>

        <div class="space-y-2">
          <p class="text-3xl font-bold text-gray-900">${{ product.price.toFixed(2) }}</p>
          <p class="text-sm text-green-600">Free delivery</p>
          <p class="text-sm text-gray-600">Expected delivery: {{ deliveryDate }}</p>
        </div>

        <div class="border-t border-b py-4">
          <p class="text-sm text-gray-600">Sold by: <span class="font-medium text-gray-900">{{ product.seller || 'Official Store' }}</span></p>
          <p class="mt-1 text-sm" :class="product.stock > 10 ? 'text-green-600' : 'text-orange-600'">
            {{ product.stock > 10 ? 'In Stock' : `Only ${product.stock} left` }}
          </p>
        </div>

        <div class="flex items-center gap-4">
          <div class="w-24">
            <input 
              type="number" 
              v-model.number="quantity" 
              min="1" 
              :max="product.stock"
              class="w-full px-3 py-2 border rounded-lg"
            >
          </div>
          <button 
            @click="addToCart(product)"
            :disabled="product.stock === 0"
            class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            Add to Cart
          </button>
        </div>

        <!-- Product Description -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Product Description</h2>
          <p class="text-gray-600">{{ product.description }}</p>
        </div>

        <!-- Specifications -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Specifications</h2>
          <div class="grid grid-cols-2 gap-4">
            <div v-for="(spec, index) in specifications" :key="index" class="text-sm">
              <span class="font-medium text-gray-900">{{ spec.label }}:</span>
              <span class="ml-2 text-gray-600">{{ spec.value }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reviews Section -->
    <div class="mt-16">
      <h2 class="text-2xl font-bold mb-8">Ratings & Reviews</h2>
      
      <!-- Review Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div class="space-y-2">
          <div class="flex items-baseline gap-4">
            <span class="text-5xl font-bold">{{ averageRating.toFixed(1) }}</span>
            <div class="text-yellow-400 text-xl">
              <span v-for="star in 5" :key="star">
                <span v-if="star <= Math.floor(averageRating)" class="full-star">★</span>
                <span v-else-if="star === Math.ceil(averageRating) && averageRating % 1 !== 0" class="partial-star">
                  <span class="half-filled">★</span>
                  <span class="half-empty">☆</span>
                </span>
                <span v-else class="empty-star">☆</span>
              </span>
            </div>
          </div>
          <p class="text-sm text-gray-600">Based on {{ totalReviews }} reviews</p>
        </div>
        
        <!-- Rating Distribution Bars (Clickable) -->
        <div class="col-span-2">
          <div v-for="n in 5" :key="n" class="flex items-center gap-4 mb-2">
            <span 
              class="text-sm w-8 cursor-pointer"
              :class="{ 'font-bold text-blue-600': selectedRatings.includes(6 - n) }"
              @click="toggleRatingFilter(6 - n)"
            >
              {{ 6 - n }}★
            </span>
            <div 
              class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden cursor-pointer"
              @click="toggleRatingFilter(6 - n)"
            >
              <div 
                class="h-full bg-yellow-400 rounded-full"
                :style="`width: ${(ratingDistribution[6 - n] / totalReviews * 100) || 0}%`"
              ></div>
            </div>
            <span 
              class="text-sm w-16 cursor-pointer"
              :class="{ 'font-bold text-blue-600': selectedRatings.includes(6 - n) }"
              @click="toggleRatingFilter(6 - n)"
            >
              {{ ratingDistribution[6 - n] || 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Add Review Form -->
      <div v-if="reviewStore.canReview && !reviewStore.userReview" class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Write a Review</h3>
        <form @submit.prevent="submitReview">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Rating</label>
            <div class="flex items-center mt-1">
              <span
                v-for="star in 5"
                :key="star"
                class="text-2xl cursor-pointer"
                :class="{
                  'text-yellow-400': star <= newReview.rating,
                  'text-gray-300': star > newReview.rating
                }"
                @click="setRating(star)"
              >
                ★
              </span>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              v-model="newReview.comment"
              class="mt-1 block w-full p-2 border rounded-lg"
              rows="4"
              placeholder="Share your thoughts about the product..."
            ></textarea>
          </div>
          <button
            type="submit"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Submit Review
          </button>
        </form>
      </div>

      <!-- Edit Review Form -->
      <div v-if="isEditing" class="mb-8">
        <h3 class="text-xl font-semibold mb-4">Edit Your Review</h3>
        <form @submit.prevent="updateReview">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Rating</label>
            <div class="flex items-center mt-1">
              <span
                v-for="star in 5"
                :key="star"
                class="text-2xl cursor-pointer"
                :class="{
                  'text-yellow-400': star <= editingReview.rating,
                  'text-gray-300': star > editingReview.rating
                }"
                @click="setRating(star)"
              >
                ★
              </span>
            </div>
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              v-model="editingReview.comment"
              class="mt-1 block w-full p-2 border rounded-lg"
              rows="4"
              placeholder="Update your review..."
            ></textarea>
          </div>
          <div class="flex gap-2">
            <button
              type="submit"
              class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Update Review
            </button>
            <button
              type="button"
              @click="cancelEdit"
              class="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      <!-- Review List -->
      <div v-if="filteredReviews.length > 0" class="space-y-6">
        <!-- User's Review (Always at the top, hidden when editing) -->
        <div v-if="reviewStore.userReview && !isEditing" class="border-b pb-6">
          <div class="flex items-center gap-4">
            <div class="text-yellow-400 text-xl">
              {{ "★".repeat(reviewStore.userReview.rating) }}{{ "☆".repeat(5 - reviewStore.userReview.rating) }}
            </div>
            <div class="text-gray-600 text-sm">
              Reviewed by <span class="font-medium">{{ reviewStore.userReview.User?.username || 'You' }}</span>
            </div>
            <div class="ml-auto flex gap-2">
              <button
                @click="editReview(reviewStore.userReview)"
                class="text-sm text-blue-600 hover:text-blue-700"
              >
                ✏️ Edit
              </button>
              <button
                @click="confirmDeleteReview(reviewStore.userReview.id)"
                class="text-sm text-red-600 hover:text-red-700"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
          <p class="mt-2 text-gray-800">{{ reviewStore.userReview.comment }}</p>
        </div>

        <!-- Other Reviews -->
        <div v-for="review in filteredReviews.filter(r => r.id !== reviewStore.userReview?.id)" :key="review.id" class="border-b pb-6">
          <div class="flex items-center gap-4">
            <div class="text-yellow-400 text-xl">
              {{ "★".repeat(review.rating) }}{{ "☆".repeat(5 - review.rating) }}
            </div>
            <div class="text-gray-600 text-sm">
              Reviewed by <span class="font-medium">{{ review.User?.username || 'Anonymous' }}</span>
            </div>
          </div>
          <p class="mt-2 text-gray-800">{{ review.comment }}</p>
        </div>
      </div>
      <div v-else class="text-gray-600">
        No reviews yet.
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/products';
import { useCartStore } from '@/stores/cart';
import { useReviewStore } from '@/stores/reviewStore';

export default {
  name: 'ProductDetails',
  setup() {
    const route = useRoute();
    const productStore = useProductStore();
    const cartStore = useCartStore();
    const reviewStore = useReviewStore();
    
    const product = ref(null);
    const quantity = ref(1);
    const selectedImage = ref(null);
    const isZoomed = ref(false);
    const zoomPosition = ref({ x: 0, y: 0 });
    const mainImage = ref(null);

    const productImages = computed(() => [
      product.value?.imageUrl,
      '/api/placeholder/400/400',
      '/api/placeholder/400/400',
      '/api/placeholder/400/400'
    ]);

    const specifications = computed(() => [
      { label: 'Brand', value: product.value?.brand || 'Generic' },
      { label: 'Model', value: product.value?.model || 'Standard' },
      { label: 'Color', value: product.value?.color || 'Various' },
      { label: 'Weight', value: product.value?.weight || '0.5 kg' },
    ]);

    const reviews = computed(() => reviewStore.reviews);
    const totalReviews = computed(() => reviews.value.length);

    const averageRating = computed(() => {
      if (totalReviews.value === 0) return 0;
      const sum = reviews.value.reduce((acc, review) => acc + review.rating, 0);
      return sum / totalReviews.value;
    });

    const ratingDistribution = computed(() => {
      const distribution = {};
      reviews.value.forEach(review => {
        distribution[review.rating] = (distribution[review.rating] || 0) + 1;
      });
      return distribution;
    });

    const deliveryDate = computed(() => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long',
        day: 'numeric' 
      });
    });

    const zoomStyle = computed(() => {
      if (!isZoomed.value) return {};
      return {
        transform: 'scale(2)',
        transformOrigin: `${zoomPosition.value.x}% ${zoomPosition.value.y}%`
      };
    });

    const handleZoom = (event) => {
      if (!mainImage.value) return;
      
      const rect = mainImage.value.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      
      zoomPosition.value = { x, y };
      isZoomed.value = true;
    };

    const addToCart = (product) => {
      if (!product) return;
      
      cartStore.addToCart({
        ...product,
        quantity: quantity.value
      });
    };

    // Review Management
    const newReview = ref({ rating: 5, comment: '' });
    const isEditing = ref(false);
    const editingReview = ref({ id: null, rating: 5, comment: '' });

    const setRating = (star) => {
      if (isEditing.value) {
        editingReview.value.rating = star;
      } else {
        newReview.value.rating = star;
      }
    };

    const submitReview = async () => {
      try {
        await reviewStore.addReview(route.params.id, newReview.value);
        newReview.value = { rating: 5, comment: '' };
        await reviewStore.fetchReviews(route.params.id);
        await reviewStore.getUserReview(route.params.id);
      } catch (error) {
        console.error('Failed to submit review:', error);
      }
    };

    const editReview = (review) => {
      isEditing.value = true;
      editingReview.value = { ...review };
    };

    const updateReview = async () => {
      try {
        await reviewStore.updateReview(editingReview.value.id, editingReview.value);
        isEditing.value = false;
        await reviewStore.fetchReviews(route.params.id);
        await reviewStore.getUserReview(route.params.id);
      } catch (error) {
        console.error('Failed to update review:', error);
      }
    };

    const confirmDeleteReview = (reviewId) => {
      if (confirm('Are you sure you want to delete this review?')) {
        deleteReview(reviewId);
      }
    };

    const deleteReview = async (reviewId) => {
      try {
        await reviewStore.deleteReview(reviewId);
        isEditing.value = false;
        await reviewStore.fetchReviews(route.params.id);
        await reviewStore.getUserReview(route.params.id);
      } catch (error) {
        console.error('Failed to delete review:', error);
      }
    };

    const cancelEdit = () => {
      isEditing.value = false;
      editingReview.value = { id: null, rating: 5, comment: '' };
    };

    // Rating Filter Logic
    const selectedRatings = ref([]);

    const toggleRatingFilter = (rating) => {
      if (selectedRatings.value.includes(rating)) {
        selectedRatings.value = selectedRatings.value.filter(r => r !== rating);
      } else {
        selectedRatings.value.push(rating);
      }
    };

    const filteredReviews = computed(() => {
      if (selectedRatings.value.length === 0) return reviews.value;
      return reviews.value.filter(review => selectedRatings.value.includes(review.rating));
    });

    onMounted(async () => {
      const productId = route.params.id;
      product.value = await productStore.fetchProduct(productId);
      await reviewStore.fetchReviews(productId);
      await reviewStore.checkReviewEligibility(productId);
      await reviewStore.getUserReview(productId);
    });

    return {
      product,
      quantity,
      selectedImage,
      productImages,
      specifications,
      deliveryDate,
      isZoomed,
      zoomStyle,
      mainImage,
      handleZoom,
      addToCart,
      reviews,
      totalReviews,
      averageRating,
      ratingDistribution,
      reviewStore,
      newReview,
      isEditing,
      editingReview,
      setRating,
      submitReview,
      editReview,
      updateReview,
      confirmDeleteReview,
      deleteReview,
      cancelEdit,
      selectedRatings,
      toggleRatingFilter,
      filteredReviews,
    };
  }
};
</script>

<style scoped>
textarea {
  resize: none;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Partial Star Styles */
.partial-star {
  position: relative;
  display: inline-block;
}
.half-filled {
  position: absolute;
  width: 50%;
  overflow: hidden;
  color: #f1c40f;
}
.half-empty {
  color: #ddd;
}

/* Rating Filter Highlight */
.selected-rating {
  border: 2px solid #3b82f6;
  border-radius: 4px;
}
</style>