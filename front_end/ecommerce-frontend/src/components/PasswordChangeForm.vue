<!-- components/PasswordChangeForm.vue
<template>
    <div class="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h2 class="text-xl font-semibold mb-4">Change Password</h2>
      
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-1">Current Password</label>
          <input v-model="currentPassword" type="password" required
                 class="w-full px-3 py-2 border rounded-md" />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">New Password</label>
          <input v-model="newPassword" type="password" required
                 class="w-full px-3 py-2 border rounded-md" />
        </div>
        
        <div>
          <label class="block text-sm font-medium mb-1">Confirm New Password</label>
          <input v-model="confirmPassword" type="password" required
                 class="w-full px-3 py-2 border rounded-md" />
        </div>
  
        <div v-if="error" class="text-red-600 text-sm">{{ error }}</div>
        <div v-if="success" class="text-green-600 text-sm">{{ success }}</div>
  
        <button type="submit" :disabled="loading"
                class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          {{ loading ? 'Updating...' : 'Change Password' }}
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import api from '../services/api';
  
  const currentPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  
  const validateForm = () => {
    if (newPassword.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return false;
    }
    if (newPassword.value.length < 8) {
      error.value = 'Password must be at least 8 characters';
      return false;
    }
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    loading.value = true;
    error.value = '';
    success.value = '';
    
    try {
      await api.post('/auth/change-password', {
        currentPassword: currentPassword.value,
        newPassword: newPassword.value
      });
      
      success.value = 'Password changed successfully';
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
    } catch (err) {
      error.value = err.response?.data?.error || 'Error changing password';
    } finally {
      loading.value = false;
    }
  };
  </script> -->

  