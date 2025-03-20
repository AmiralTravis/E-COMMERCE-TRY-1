<!-- /components/Seller/ProductImageManagamenet.vue -->

<template>
    <section class="panel mt-6 main-panel">
      <FileUploadProgress
        :isUploading="isUploading"
        :progress="uploadProgress"
        :currentFile="currentFile"
        :fileCount="totalFiles"
        :completedFiles="completedFiles"
      />
  
      <h2 class="section-title text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Product Images</h2>
      <div class="image-management-container">
        <!-- Main Display Image with Upload -->
        <div class="main-image-container group" @click="triggerMainImageUpload">
          <div class="product-image-container">
            <div v-if="mainImage" class="product-image-preview">
              
            <img 
                :src="mainImage.thumbnail || mainImage.url" 
                :data-full-src="mainImage.url" 
                alt="Main product image"
                class="product-image"
            />          
              <button 
                @click.stop="removeMainImage"
                class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-red-50"
              >
                <TrashIcon class="w-4 h-4 text-red-500" />
              </button>
              <button
                @click.stop="triggerMainImageUpload"
                class="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-sm shadow-sm hover:bg-gray-100"
              >
                Change Image
              </button>
            </div>
            <div v-else class="upload-prompt">
              <div class="flex flex-col items-center justify-center w-full h-full">
                <PlusCircleIcon class="w-12 h-12 text-gray-400 mb-2" />
                <p class="text-gray-500 text-sm">Upload Main Image</p>
              </div>
            </div>
            <input 
              ref="mainImageInput"
              type="file"
              accept="image/jpeg, image/png, image/webp"
              class="hidden"
              @change="handleMainImageUpload"
            />
          </div>
        </div>
  
        <!-- Thumbnails and Upload Section -->
        <div class="thumbnails-section">
          <div class="thumbnails-container" ref="thumbnailsContainer">
            <!-- Map each image to a thumbnail -->
            <div 
              v-for="(image, index) in productImages" 
              :key="image?.id || index"
              class="thumbnail-container"
              data-type="image"
            >
              
              <img 
                  v-if="image"
                  :src="image.thumbnail" 
                  :data-full-src="image?.url" 
                  alt="Product thumbnail" 
                  class="thumbnail-image w-full h-full object-cover"
                  @click="openLightbox(index)"
              />
              <button 
                @click.stop="removeImage(index)" 
                class="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm hover:bg-red-50"
              >
                <TrashIcon class="w-4 h-4 text-red-500" />
              </button>
            </div>
  
            <!-- Add Thumbnail Button -->
            <div 
              v-if="productImages.length < 20" 
              class="add-image-container"
              data-type="add-button"
              @click="triggerFileUpload"
            >
              <input 
                ref="fileInput"
                type="file"
                accept="image/jpeg, image/png, image/webp"
                multiple
                class="hidden"
                @change="handleFileUpload"
              />
              <PlusCircleIcon class="w-8 h-8 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Lightbox -->
      <div v-if="lightboxVisible" class="lightbox" @click="closeLightbox">
        <div class="lightbox-content">
          <div 
            class="zoom-container"
            :class="{'cursor-zoom-in': !zoomActive, 'cursor-zoom-out': zoomActive}"
            @click.stop="toggleZoomActive"
            @mousemove="handleZoom"
            @mouseleave="isZoomed = false"
            :title="zoomActive ? 'Click to disable zoom' : 'Click to enable hover-zoom'"
          >
            <div v-if="!zoomActive" class="zoom-hint">Click to zoom</div>
            <img 
              :src="productImages[lightboxIndex]?.url" 
              alt="Product image"
              class="lightbox-image"
              ref="lightboxImage"
              :style="zoomStyle"
            />
          </div>
          <button 
            class="lightbox-close"
            @click.stop="closeLightbox"
          >×</button>
          <button 
            class="lightbox-nav prev"
            @click.stop="prevImage"
          >&#10094;</button>
          <button 
            class="lightbox-nav next"
            @click.stop="nextImage"
          >&#10095;</button>
        </div>
      </div>
  
      <!-- Help Text -->
      <div class="mt-3 text-sm text-gray-500 flex justify-between items-center">
        <span>Drag to reorder. Maximum 20 images allowed. <br>Note: Images will be displayed in the order arranged in here. </span>
        <span>{{ productImages?.length || 0 }}/20 images</span>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, nextTick } from 'vue';
  import { TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline';
  import Sortable from 'sortablejs';
  import { toast } from 'vue3-toastify';
  import api from '@/services/api';
  import { useRoute } from 'vue-router';
  import { update } from 'lodash';
  import FileUploadProgress from '@/components/FileUploadProgress.vue';
  
  const route = useRoute();
  
  // Props to receive and emit product images
  const props = defineProps({
    modelValue: {
      type: Array,
      default: () => []
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  // Image states
  const mainImage = ref(null);
  
  
  
  const productImages = ref([]); // Initialize as an empty array
  
  // Lightbox state
  const lightboxVisible = ref(false);
  const lightboxIndex = ref(0);
  const lightboxImage = ref(null);
  
  const isZoomed = ref(false);
  const zoomActive = ref(false); // Toggleable zoom state
  const zoomPosition = ref({ x: 0, y: 0 });
  
  const placeholderImage = ref('@assets/default-thumbnail.jpg');
  
  
  // Refs
  const mainImageInput = ref(null);
  const fileInput = ref(null);
  const thumbnailsContainer = ref(null);
  
  
  const isUploading = ref(false);
  const uploadProgress = ref(0);
  const currentFile = ref('');
  const totalFiles = ref(1);
  const completedFiles = ref(0);
  
  const totalImages = computed(() => 
    (mainImage.value ? 1 : 0) + (productImages.value?.length || 0)
  );
  
  // Load product images on mount
  
  const loadProductImages = async () => {
    try {
      // Skip if no product ID (e.g., on the Add Product page)
      if (!route.params.id) {
        productImages.value = [];
        mainImage.value = null;
        return;
      }
  
      const response = await api.get(`/seller/products/${route.params.id}`);
      // Ensure images array exists
      productImages.value = response.data.images || response.data.productImages || [];
      mainImage.value = response.data.mainImage || null;
    } catch (error) {
      console.error('Error loading product images:', error);
      toast.error('Failed to load product images');
    }
  };
  
  onMounted(async () => {
    await loadProductImages();
  });
  
  // Main image handling
  const triggerMainImageUpload = () => {
    mainImageInput.value.click();
  };
  
  const handleMainImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    // Client-side validation
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await api.put(
        `/seller/products/${route.params.id}/main-image`, 
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' }
    });
      
      // Update to match new structure
      mainImage.value = { url: response.data.imageUrl };
      toast.success('Main image updated');
  
    } catch (error) {
      toast.error('Failed to upload main image');
    }
  };
  
  // Thumbnail handling
  const triggerFileUpload = () => {
    if (productImages.value.length >= 20) {
      toast.error('Maximum 20 thumbnails allowed');
      return;
    }
    fileInput.value.click();
  };
  
  
  const handleFileUpload = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      toast.error('No files selected');
      return;
    }
  
    // Check remaining slots
    const remainingSlots = 20 - (productImages.value?.length || 0);
    if (files.length > remainingSlots) {
      toast.error(`You can only upload ${remainingSlots} more thumbnails`);
      return;
    }
  
    // Validate file sizes and types
    let valid = true;
    Array.from(files).forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds 5MB size limit`);
        valid = false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image file`);
        valid = false;
      }
    });
  
    if (!valid) return;
  
    try {
  
      isUploading.value = true;
      totalFiles.value = files.length;
      completedFiles.value = 0;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        currentFile.value = file.name;
        uploadProgress.value = 0;
  
        const formData = new FormData();
        // Array.from(files).forEach(file => {
        //   formData.append('thumbnails', file);
        // });
  
        formData.append('thumbnails', file);
  
        // Stage 1: upload to backend (0-50%)
        const response = await api.post(
          `/seller/products/${route.params.id}/thumbnails`,
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              uploadProgress.value = percentCompleted / 2;
  
              // console.log(`Upload progress: ${percentCompleted}%`);
            }
          }
        );
        // console.log(`Stage 1 Progress: ${uploadProgress.value}%`); // During upload
  
  
        // Stage 2: processing (50-100%)
        let processingProgress = 50;
        // console.log("Setting up interval...")
        const interval = setInterval(() => {
          try {
          if (processingProgress < 90) {
            processingProgress += 1;
            uploadProgress.value = processingProgress;
          }
          } catch(error) {
            console.error("Error in setInterval callback: ", error);
          }
        }, 10); //Increase progress every 50ms
        // console.log(`Stage 2 Progress: ${uploadProgress.value}%`); // During processing
  
        // to hold backend response until setInterval runs for a second
        await new Promise(resolve => setTimeout(resolve, 1000));
  
        // Wait for backend to complete processing
        const finalResponse = await response.data;
  
        clearInterval(interval);
  
        // Only set to progress 100% if upload was successful
        if (finalResponse.success) {
          uploadProgress.value = 100;
          
          // Update the productImages array reactively
          productImages.value = [
            ...productImages.value,
            // ...finalResponse.images.map(img => ({
            ...finalResponse.uploadedImages.map(img => ({
              id: img.id,
              url: img.url,
              thumbnail: img.thumbnail,
              order: productImages.value.length // Maintain order
            }))
          ];
  
          completedFiles.value += 1;
        } else {
          toast.error(`Faild to upload ${file.name}`);
          uploadProgress.value = 0;
        }
  
      }
  
      
      
  
        toast.success('Thumbnails added successfully');
      
    } catch (error) {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.details || 
                          'Failed to upload thumbnails, kindly make sure that the file is jpeg, png, or webp format';
      toast.error(error.response?.data?.details || errorMessage);
      uploadProgress.value = 0; //Reset progress on error
  
    } finally {
      // Delay for 100% to be visible for a period of time to user
      await new Promise(resolve => setTimeout(resolve, 500));
  
      isUploading.value = false;
      event.target.value = ''; // Clear the file input
    }
  };
  
  const toggleZoomActive = () => {
    zoomActive.value = !zoomActive.value;
    if (!zoomActive.value) {
      isZoomed.value = false;
    }
  };
  
  const handleZoom = (event) => {
    if (!zoomActive.value || !lightboxImage.value) return;
    
    const rect = lightboxImage.value.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    
    zoomPosition.value = { x, y };
    isZoomed.value = true;
  };
  
  const zoomStyle = computed(() => {
    if (!isZoomed.value || !zoomActive.value) return {};
    return {
      transform: 'scale(2.5)',
      transformOrigin: `${zoomPosition.value.x}% ${zoomPosition.value.y}%`
    };
  });
  
  // Lightbox navigation
  const prevImage = () => {
    lightboxIndex.value = lightboxIndex.value > 0 
      ? lightboxIndex.value - 1 
      : (productImages.value?.length || 0) - 1;
    resetZoomState();
  };
  
  const nextImage = () => {
    lightboxIndex.value = lightboxIndex.value < (productImages.value?.length || 0) - 1 
      ? lightboxIndex.value + 1 
      : 0;
    resetZoomState();
  };
  
  const resetZoomState = () => {
    zoomActive.value = false;
    isZoomed.value = false;
  };
  
  // Open lightbox
  const openLightbox = (index) => {
    lightboxIndex.value = index;
    lightboxVisible.value = true;
    resetZoomState();
  };
  
  // Close lightbox
  const closeLightbox = () => {
    lightboxVisible.value = false;
    resetZoomState();
  };
  
  // Remove an image
  const removeImage = async (index) => {
    const image = productImages.value?.[index];
    if (!image?.id) {
      productImages.value.splice(index, 1);
      return;
    }
  
    try {
      await api.delete(`/seller/products/${route.params.id}/images/${image.id}`);
      productImages.value.splice(index, 1);
      toast.success('Image removed');
    } catch (error) {
      toast.error('Failed to remove image');
    }
  };
  
  const removeMainImage = () => {
    mainImage.value = null;
  };
  
  // Initialize Sortable.js for drag and drop
  
  onMounted(() => {
    if (thumbnailsContainer.value && productImages.value) {
      Sortable.create(thumbnailsContainer.value, {
        animation: 150,
        filter: '[data-type="add-button"]', //Prevent dragging the add button
        preventOnFilter: false,
        onMove: function(evt) {
          const targetNode = evt.related;
          if (targetNode && targetNode.getAttribute('data-type') === 'add-button') {
            return false;  // Prevent dragging over  the add-button
          }
        },
        onEnd: (evt) => {
          if (evt.oldIndex === evt.newIndex) return; //No change
  
          // Create a new array to maintain reactivity
          const newImages = [... productImages.value];
          const [movedItem] = newImages.splice(evt.oldIndex, 1);
          newImages.splice(evt.newIndex, 0, movedItem);
  
          // Update the order property for all images
          const updatedImages = newImages.map((img, index) => ({
            ...img,
            order: index
          }));
  
          // Update the reactive array
          productImages.value = updatedImages;
  
          emit('update:modelValue', updatedImages);
        }
      });
    }
  });
  
  </script>
  
  <style scoped>
  .main-panel {
    min-height: 400px;
  }
  
  .image-management-container {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .main-image-container {
    position: relative;
    width: 300px;
    height: 300px;
    background-color: #f3f4f6;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 2px dashed #e5e7eb;
    cursor: pointer;
    transition: border-color 0.3s;
  }
  
  .main-image-container:hover {
    border-color: #3b82f6;
  }
  
  .product-image-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .product-image-preview {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }
  
  .product-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
  
  .upload-prompt {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    text-align: center;
  }
  
  .thumbnails-section {
    width: calc(100% - 300px - 1rem);
  }
  
  .thumbnails-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: 0.5rem;
  }
  
  .thumbnail-container {
    position: relative;
    width: 100%;
    height: 100px;
    background-color: #f3f4f6;
    border-radius: 0.5rem;
    overflow: hidden;
    border: 1px solid #e5e7eb;
    cursor: pointer;
    @apply w-[100px] h-[100px] overflow-hidden flex items-center justify-center;
  
  }
  
  .thumbnail-image {
    /* @apply w-full h-full object-cover object-center;
    image-rendering: -webkit-optimize-contrast;  */
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 0.3s ease;
  }
  
  
  .add-image-container {
    width: 100%;
    height: 100px;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    border: 1px dashed #d1d5db;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    @apply w-[100px] h-[100px]; /* Match thumbnail dimensions */
  
  }
  
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .lightbox-content {
    position: relative;
    width: 80vw;
    height: 80vh;
    max-width: 1200px;
  }
  
  .zoom-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: cursor 0.2s;
  }
  
  .lightbox-image {
    max-width: 100%;
    max-height: 100%;
    /* max-width: 90vw;
    max-height: 90vh; */
    object-fit: contain;
    /* transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); */
  }
  
  .cursor-zoom-in {
    cursor: zoom-in;
  }
  
  .cursor-zoom-out {
    cursor: zoom-out;
  }
  
  .lightbox-close {
    position: absolute;
    top: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    font-size: 24px;
    cursor: pointer;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }
  
  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    padding: 15px;
    cursor: pointer;
    z-index: 1001;
    font-size: 24px;
    line-height: 1;
    transition: all 0.3s ease;
  }
  
  .lightbox-nav.prev {
    left: 20px;
  }
  
  .lightbox-nav.next {
    right: 20px;
  }
  
  @media (max-width: 768px) {
    .image-management-container {
      flex-direction: column;
    }
    
    .thumbnails-section {
      width: 100%;
      margin-top: 1rem;
    }
    
    .main-image-container {
      width: 100%;
      height: 300px;
    }
  }
  </style>