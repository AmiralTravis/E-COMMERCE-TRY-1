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
            <div class="flex items-center">
              <div class="text-yellow-400">
                {{ "★".repeat(Math.floor(averageRating)) }}
                {{ "☆".repeat(5 - Math.floor(averageRating)) }}
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
              {{ "★".repeat(Math.floor(averageRating)) }}{{ "☆".repeat(5 - Math.floor(averageRating)) }}
            </div>
          </div>
          <p class="text-sm text-gray-600">Based on {{ totalReviews }} reviews</p>
        </div>
        
        <div class="col-span-2">
          <div v-for="n in 5" :key="n" class="flex items-center gap-4 mb-2">
            <span class="text-sm w-8">{{ 6-n }}★</span>
            <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-yellow-400 rounded-full"
                :style="`width: ${(ratingDistribution[6-n] / totalReviews * 100) || 0}%`"
              ></div>
            </div>
            <span class="text-sm w-16">{{ ratingDistribution[6-n] || 0 }}</span>
          </div>
        </div>
      </div>

      <!-- Review List -->
      <div v-if="reviews.length > 0" class="space-y-6">
        <div v-for="review in reviews" :key="review.id" class="border-b pb-6">
          <div class="flex items-center gap-4">
            <div class="text-yellow-400 text-xl">
              {{ "★".repeat(review.rating) }}{{ "☆".repeat(5 - review.rating) }}
            </div>
            <div class="text-gray-600 text-sm">
              Reviewed by <span class="font-medium">{{ review.User.username }}</span>
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

    onMounted(async () => {
      const productId = route.params.id;
      product.value = await productStore.fetchProduct(productId);
      await reviewStore.fetchReviews(productId);
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
      ratingDistribution
    };
  }
};
</script>

<style scoped>
.product-image img {
  transition: transform 0.3s ease-out;
}
</style>