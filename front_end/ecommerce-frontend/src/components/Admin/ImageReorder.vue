<!-- /components/Admin/ImageReorder.vue -->

<template>
    <div class="image-reorder">
      <draggable 
        v-model="images" 
        @end="handleReorder"
        item-key="id"
        class="grid grid-cols-3 md:grid-cols-5 gap-4"
      >
        <template #item="{ element }">
          <div class="image-item">
            <img 
              :src="getOptimizedImage(element.path, 'thumbnail')" 
              :alt="`Image ${element.id}`"
              class="thumbnail"
            />
            <span class="order-badge">{{ element.order }}</span>
          </div>
        </template>
      </draggable>
  
      <button 
        v-if="hasChanges"
        @click="saveOrder"
        class="btn-primary mt-4"
        :disabled="isSaving"
      >
        {{ isSaving ? 'Saving...' : 'Save Order' }}
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import draggable from 'vuedraggable';
  import { getOptimizedImage } from '@/utils/imageHelper';
  import { useProductStore } from '@/stores/products';
  
  const props = defineProps({
    productId: {
      type: Number,
      required: true
    },
    initialImages: {
      type: Array,
      default: () => []
    }
  });
  
  const productStore = useProductStore();
  const images = ref([...props.initialImages]);
  const isSaving = ref(false);
  
  // Check if the order has changed
  const hasChanges = computed(() => {
    return JSON.stringify(images.value) !== JSON.stringify(props.initialImages);
  });
  
  // Handle reorder event
  const handleReorder = () => {
    images.value = images.value.map((img, index) => ({
      ...img,
      order: index + 1
    }));
  };
  
  // Save the new order to the backend
  const saveOrder = async () => {
    try {
      isSaving.value = true;
      await productStore.updateImageOrder(props.productId, images.value);
    } finally {
      isSaving.value = false;
    }
  };
  </script>
  
  <style scoped>
  .image-reorder {
    @apply p-4 bg-white rounded-lg shadow-sm;
  }
  
  .image-item {
    @apply relative cursor-move;
  }
  
  .thumbnail {
    @apply w-full h-24 object-cover rounded-lg border border-gray-200;
  }
  
  .order-badge {
    @apply absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded-full;
  }
  
  .btn-primary {
    @apply bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600;
  }
  
  .btn-primary:disabled {
    @apply bg-gray-300 cursor-not-allowed;
  }
  </style>