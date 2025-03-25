<!-- src/components/LogIn.vue-->

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
        key="login-box"
        class="w-full max-w-md p-10 bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg border border-stone-200/50"
      >
        <div class="mb-8 text-center">
          <h1 class="text-3xl font-playfair text-emerald-900">Log In</h1>
          <p class="mt-2 text-stone-600 font-light">Enter your credentials to continue</p>
        </div>
        
        <form @submit.prevent="login" class="space-y-6">
          <div class="space-y-2">
            <label for="username" class="block text-sm font-medium text-emerald-900 font-libre">Username or Email</label>
            <div class="relative">
              <input 
                type="text" 
                id="username" 
                v-model.trim="username" 
                required
                class="w-full pl-4 pr-10 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all duration-200 bg-white/50 font-libre"
                :class="{ 'border-red-500': error }"
              >
            </div>
          </div>

          <div class="space-y-2">
            <label for="password" class="block text-sm font-medium text-emerald-900 font-libre">Password</label>
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

            <!-- Forgot Password Link -->
            <div class="text-right">
              <router-link 
                to="/forgot-password" 
                class="text-sm text-emerald-900 hover:text-emerald-800 underline font-medium"
              >
                Forgot Password?
              </router-link>
            </div>
          </div>

          <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p class="text-red-600 text-sm font-libre">{{ error }}</p>
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-emerald-900 text-white py-3 rounded-lg hover:bg-emerald-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium font-libre shadow-lg hover:shadow-xl"
          >
            <span v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
            <span v-else>Log In</span>
          </button>

          <div class="text-center text-sm text-stone-600 font-libre">
            <p>Need an account? 
              <router-link 
                to="/signup" 
                class="text-emerald-900 hover:text-emerald-800 underline font-medium"
              >
                Create one
              </router-link>
            </p>
          </div>
        </form>
      </div>
    </transition>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth';

export default {
  name: 'LogIn',
  data() {
    return {
      username: '',
      password: '',
      error: null,
      isLoading: false,
      showPassword: false,
      rememberMe: false,
    };
  },
  methods: {
    async login() {
      this.isLoading = true;
      this.error = null;
      const authStore = useAuthStore();

      try {
        await authStore.login({
          username: this.username,
          password: this.password,
          rememberMe: this.rememberMe
        });

        if (authStore.isAuthenticated) {
          const redirect = this.$route.query.redirect || '/';
          this.$router.push(redirect);
        }
      } catch (error) {
        this.error = error.response?.data?.message || 'Invalid email or password';
      } finally {
        this.isLoading = false;
      }
    }
  },
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
