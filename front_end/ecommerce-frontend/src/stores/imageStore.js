// src/stores/imageStore.js
import { defineStore } from 'pinia';
import { useApi } from '@/composables/useApi';

export const useImageStore = defineStore('images', {
  actions: {
    async uploadProductImages(productId, files) {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      return useApi().post(
        `/products/${productId}/images`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
    },

    async updateAvatar(file) {
      const formData = new FormData();
      formData.append('avatar', file);

      return useApi().put(
        '/users/avatar',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
    }
  }
});