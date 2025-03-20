<!-- /components/Admin/ImageGrid.vue -->
<template>
    <div class="image-grid">
      <div 
        v-for="image in images" 
        :key="image.id" 
        class="image-item"
        :class="{ selected: selectedImages.includes(image.id) }"
      >
        <input 
          type="checkbox" 
          v-model="selectedImages" 
          :value="image.id" 
          class="image-checkbox"
        />
        <img :src="getOptimizedImage(image.path, 'thumbnail')" class="thumbnail" />
        <button @click="deleteImage(image.id)" class="delete-button">Delete</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { getOptimizedImage } from '@/utils/imageHelper';
  
  const props = defineProps({
    images: {
      type: Array,
      required: true,
    },
  });
  
  const emit = defineEmits(['delete', 'update:selectedImages']);
  
  const selectedImages = ref([]);
  
  function deleteImage(imageId) {
    emit('delete', imageId);
  }
  </script>
  
  <style scoped>
  .image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 20px;
  }
  
  .image-item {
    position: relative;
    background: white;
    padding: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .image-checkbox {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  
  .thumbnail {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 4px;
  }
  
  .delete-button {
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 5px 10px;
    background: #e53e3e;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .selected {
    border: 2px solid #4a5568;
  }
  </style>