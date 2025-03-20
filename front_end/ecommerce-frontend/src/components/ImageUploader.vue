<!-- /src/components/ImageUploader.vue -->

<template>
    <div class="image-uploader">
      <div 
        class="dropzone"
        @dragover.prevent="drag = true"
        @dragleave="drag = false"
        @drop="handleDrop"
        :class="{ 'drag-active': drag }"
      >
        <input
          type="file"
          ref="fileInput"
          multiple
          :accept="allowedTypes"
          @change="handleFileSelect"
          hidden
        />
        <div v-if="!files.length" class="upload-prompt">
          <button @click.prevent="$refs.fileInput.click()" class="btn-primary">
            Select Files
          </button>
          <p>or drag and drop here</p>
          <p class="text-sm text-gray-500">Max {{ maxFiles }} files ({{ maxSizeMB }}MB each)</p>
        </div>
        <div v-else class="preview-grid">
          <div 
            v-for="(file, index) in files"
            :key="file.id"
            class="preview-item"
          >
            <img 
              :src="file.preview" 
              alt="Preview"
              class="preview-image"
            />
            <button 
              @click="removeFile(index)"
              class="remove-btn"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    maxFiles: { type: Number, default: 5 },
    maxSizeMB: { type: Number, default: 5 },
    allowedTypes: { type: String, default: 'image/*' }
  });
  
  const emit = defineEmits(['update:modelValue']);
  const files = ref([]);
  const drag = ref(false);
  
  const handleFileSelect = (e) => {
    processFiles([...e.target.files]);
  };
  
  const handleDrop = (e) => {
    drag.value = false;
    processFiles([...e.dataTransfer.files]);
  };
  
  const processFiles = (newFiles) => {
    const validFiles = newFiles.slice(0, props.maxFiles - files.value.length)
      .filter(file => 
        file.type.startsWith('image/') && 
        file.size <= props.maxSizeMB * 1024 * 1024
      );
  
    validFiles.forEach(file => {
      files.value.push({
        id: URL.createObjectURL(file),
        file,
        preview: URL.createObjectURL(file)
      });
    });
  
    emit('update:modelValue', files.value.map(f => f.file));
  };
  
  const removeFile = (index) => {
    URL.revokeObjectURL(files.value[index].preview);
    files.value.splice(index, 1);
    emit('update:modelValue', files.value.map(f => f.file));
  };
  </script>
  
  <style scoped>
  /* Add your Tailwind styles here */
  </style>