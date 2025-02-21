<!-- components/ForgotPassword.vue
<template>
    <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-4">Forgot Password</h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block mb-2">Email Address</label>
          <input v-model="email" type="email" required
                 class="w-full p-2 border rounded" />
        </div>
        
        <div v-if="success" class="text-green-600">{{ success }}</div>
        <div v-if="error" class="text-red-600">{{ error }}</div>
  
        <button type="submit" :disabled="loading"
                class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
          {{ loading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import api from '../services/api';
  
  const email = ref('');
  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  
  const handleSubmit = async () => {
    loading.value = true;
    error.value = '';
    success.value = '';
    
    try {
      await api.post('/auth/forgot-password', { email: email.value });
      success.value = 'Password reset link sent to your email';
    } catch (err) {
      error.value = err.response?.data?.error || 'Error sending reset link';
    } finally {
      loading.value = false;
    }
  };
  </script> -->



  <!-- components/ForgotPassword.vue -->
<template>
    <div class="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" 
         style="background-image: url('/src/assets/bkgrnd.jpg')">
         <router-link 
  to="/" 
  class="absolute top-6 left-6 p-2 rounded-full bg-emerald-900/90 hover:bg-emerald-800/80 transition-colors"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
</router-link>
      <transition name="box-fade" mode="out-in">
        <div 
          key="forgot-password-box"
          class="w-full max-w-md p-10 bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg border border-stone-200/50"
        >
          <div class="mb-8 text-center">
            <h1 class="text-3xl font-playfair text-emerald-900">Forgot Password</h1>
            <p class="mt-2 text-stone-600 font-light">Enter your email to reset your password</p>
          </div>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-2">
              <label for="email" class="block text-sm font-medium text-emerald-900 font-libre">Email Address</label>
              <div class="relative">
                <input 
                  type="email" 
                  id="email" 
                  v-model.trim="email" 
                  required
                  class="w-full pl-4 pr-10 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all duration-200 bg-white/50 font-libre"
                  :class="{ 'border-red-500': error }"
                >
              </div>
            </div>
  
            <div v-if="success" class="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p class="text-green-600 text-sm font-libre">{{ success }}</p>
            </div>
  
            <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p class="text-red-600 text-sm font-libre">{{ error }}</p>
            </div>
  
            <button 
              type="submit" 
              :disabled="loading"
              class="w-full bg-emerald-900 text-white py-3 rounded-lg hover:bg-emerald-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium font-libre shadow-lg hover:shadow-xl"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
              <span v-else>Send Reset Link</span>
            </button>
  
            <div class="text-center text-sm text-stone-600 font-libre">
              <p>Remember your password? 
                <router-link 
                  to="/login" 
                  class="text-emerald-900 hover:text-emerald-800 underline font-medium"
                >
                  Log in
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </transition>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import api from '../services/api';
  
  const email = ref('');
  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  
  const handleSubmit = async () => {
    loading.value = true;
    error.value = '';
    success.value = '';
    
    try {
      await api.post('/auth/forgot-password', { email: email.value });
      success.value = 'Password reset link sent to your email';
    } catch (err) {
      error.value = err.response?.data?.error || 'Error sending reset link';
    } finally {
      loading.value = false;
    }
  };
  </script>
  
  <style scoped>
  .box-fade-enter-active,
  .box-fade-leave-active {
    transition: all 0.3s ease;
    transform-origin: center;
  }
  
  .box-fade-enter-from,
  .box-fade-leave-to {
    opacity: 0;
    transform: scale(0.95);
  }
  </style>