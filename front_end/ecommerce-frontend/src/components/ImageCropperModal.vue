<!-- /components/ImageCropperModal.vue -->
<template>
    <div class="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl w-[95%] max-w-2xl overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-xl font-semibold text-gray-800">Adjust Profile Picture</h3>
        </div>
        
        <div class="p-6">
          <div class="relative h-[400px] bg-gray-50 rounded-lg">
            <AdvancedCropper
              ref="cropper"
              :src="imageSrc"
              :stencil-props="{
                aspectRatio: 1,
                handlers: {
                  eastNorth: true,
                  northEast: true,
                  westNorth: true,
                  northWest: true,
                  westSouth: true,
                  southWest: true,
                  eastSouth: true,
                  southEast: true
                },
                movable: true,
                resizable: true,
                lines: {},
                circle: true
              }"
              class="!absolute inset-0"
              :resize-image="{
                touch: true,
                wheel: true,
                adjustStencil: false
              }"
              :transitions="true"
              :auto-zoom="true"
              image-restriction="stencil"
              @change="handleCropperChange"
            />
          </div>
  
          <!-- <div class="mt-6 space-y-2">
            <label class="block text-sm font-medium text-gray-700">Zoom</label>
            <div class="flex items-center gap-4">
              <button 
                class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                @click="decreaseZoom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
              
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                v-model="zoom"
                class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                @input="updateZoom"
              />
              
              <button 
                class="p-2 rounded-full hover:bg-gray-100 transition-colors"
                @click="increaseZoom"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div> -->
        </div>
  
        <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button 
            @click="cancel"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="save"
            class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { Cropper as AdvancedCropper } from 'vue-advanced-cropper';
  import debounce from 'lodash/debounce';
  
  export default {
    components: {
      AdvancedCropper
    },
    
    props: {
      imageSrc: {
        type: String,
        required: true
      }
    },
  
    data() {
      return {
        zoom: 1,
        coordinates: null,
        maxZoom: 3,
        minZoom: 1
      };
    },
  
    methods: {
      handleCropperChange({ coordinates }) {
        this.coordinates = coordinates;
      },
      
      updateZoom: debounce(function() {
        this.$refs.cropper.zoom(this.zoom);
      }, 50),
  
      increaseZoom() {
        this.zoom = Math.min(this.maxZoom, this.zoom + 0.1);
        this.updateZoom();
      },
  
      decreaseZoom() {
        this.zoom = Math.max(this.minZoom, this.zoom - 0.1);
        this.updateZoom();
      },
  
      cancel() {
        this.$emit('cancel');
      },
  
      async save() {
        try {
          const { canvas } = await this.$refs.cropper.getResult();
          
          canvas.toBlob(blob => {
            this.$emit('save', blob);
          }, 'image/jpeg', 0.9);
        } catch (error) {
          console.error('Error saving cropped image:', error);
        }
      }
    }
  };
  </script>
  
  <style>
  /* Custom range input styling */
  input[type="range"] {
    @apply h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    @apply appearance-none w-4 h-4 rounded-full bg-indigo-600 cursor-pointer;
  }
  
  input[type="range"]::-moz-range-thumb {
    @apply w-4 h-4 rounded-full bg-indigo-600 cursor-pointer border-0;
  }
  
  /* Ensure cropper maintains circular shape */
  .vue-advanced-cropper__stretcher {
    @apply rounded-full;
  }
  
  .vue-advanced-cropper__boundaries {
    @apply rounded-full;
  }
  </style>