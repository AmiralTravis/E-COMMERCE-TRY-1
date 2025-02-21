<!-- components/ResetPassword.vue
<template>
    <div class="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h1 class="text-2xl font-bold mb-4">Reset Password</h1>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
        <label class="block mb-2">New Password</label>
        <div class="relative">
            <input
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            required
            class="w-full p-2 border rounded"
            />
            <button
            type="button"
            @click="showPassword = !showPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
            >
            <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            </button>
        </div>
        </div>

        <div>
        <label class="block mb-2">Confirm Password</label>
        <div class="relative">
            <input
            v-model="confirmPassword"
            :type="showConfirmPassword ? 'text' : 'password'"
            required
            class="w-full p-2 border rounded"
            />
            <button
            type="button"
            @click="showConfirmPassword = !showConfirmPassword"
            class="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
            >
            <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
            </button>
        </div>
        </div>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import api from '../services/api';
  
  const route = useRoute();
  const router = useRouter();
  const token = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const error = ref('');
  const success = ref('');
  const loading = ref(false);

  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  
  onMounted(() => {
    token.value = route.query.token;
    if (!token.value) router.push('/login');
  });
  
  const validateForm = () => {
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return false;
    }
    if (password.value.length < 8) {
      error.value = 'Password must be at least 8 characters';
      return false;
    }
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    loading.value = true;
    error.value = '';
    
    try {
      await api.post('/auth/reset-password', {
        token: token.value,
        password: password.value
      });
      
      success.value = 'Password reset successfully! Redirecting to login...';
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      error.value = err.response?.data?.error || 'Error resetting password';
    } finally {
      loading.value = false;
    }
  };
  </script> -->



  <!-- components/ResetPassword.vue -->
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
          key="reset-password-box"
          class="w-full max-w-md p-10 bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg border border-stone-200/50"
        >
          <div class="mb-8 text-center">
            <h1 class="text-3xl font-playfair text-emerald-900">Reset Password</h1>
            <p class="mt-2 text-stone-600 font-light">Enter your new password</p>
          </div>
          
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <div class="space-y-2">
              <label for="password" class="block text-sm font-medium text-emerald-900 font-libre">New Password</label>
              <div class="relative">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  id="password" 
                  v-model.trim="password" 
                  required
                  class="w-full pl-4 pr-10 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all duration-200 bg-white/50 font-libre"
                  :class="{ 'border-red-500': error }"
                >
                <button 
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                >
                  <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400 hover:text-emerald-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400 hover:text-emerald-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>
  
            <div class="space-y-2">
              <label for="confirmPassword" class="block text-sm font-medium text-emerald-900 font-libre">Confirm Password</label>
              <div class="relative">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  v-model.trim="confirmPassword" 
                  required
                  class="w-full pl-4 pr-10 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all duration-200 bg-white/50 font-libre"
                  :class="{ 'border-red-500': error }"
                >
                <button 
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
                >
                  <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400 hover:text-emerald-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400 hover:text-emerald-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
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
                Resetting...
              </span>
              <span v-else>Reset Password</span>
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
  import { ref, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import api from '../services/api';
  
  const route = useRoute();
  const router = useRouter();
  const token = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const error = ref('');
  const success = ref('');
  const loading = ref(false);
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  
  onMounted(() => {
    token.value = route.query.token;
    if (!token.value) router.push('/login');
  });
  
  const validateForm = () => {
    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return false;
    }
    if (password.value.length < 8) {
      error.value = 'Password must be at least 8 characters';
      return false;
    }
    return true;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    loading.value = true;
    error.value = '';
    
    try {
      await api.post('/auth/reset-password', {
        token: token.value,
        password: password.value
      });
      
      success.value = 'Password reset successfully! Redirecting to login...';
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      error.value = err.response?.data?.error || 'Error resetting password';
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