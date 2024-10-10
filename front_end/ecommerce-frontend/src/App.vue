<!-- src/App.vue

<template>
  <div id="app">
    <HeaderFrontend />
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <FooterFrontend />
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import FooterFrontend from './components/FooterFrontend.vue';
import HeaderFrontend from './components/HeaderFrontend.vue';

export default defineComponent({
  name: 'App',
  components: {
    FooterFrontend,
    HeaderFrontend,
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    
    onMounted(async () => {
      try {
        await authStore.checkAuth();
        // Cart is already initialized from localStorage in its state
      } catch (error) {
        console.warn('Error checking authentication:', error);
        // The auth store will handle clearing auth if necessary
      }
    });
  }
});
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #2c3e50;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style> -->

<template>
  <div id="app">
    <HeaderFrontend />
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <FooterFrontend />
  </div>
</template>

<script>
import { defineComponent, onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import FooterFrontend from './components/FooterFrontend.vue';
import HeaderFrontend from './components/HeaderFrontend.vue';

export default defineComponent({
  name: 'App',
  components: {
    FooterFrontend,
    HeaderFrontend,
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    
    onMounted(async () => {
      try {
        const isAuthenticated = await authStore.checkAuth();
        if (isAuthenticated) {
          await cartStore.fetchCart();
        }
      } catch (error) {
        console.warn('Error during initialization:', error);
      }
    });
  }
});
</script>

<style>
html, body {
  height: 100%;
  margin: 0;
  font-family: 'Inter', sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  color: #2c3e50;
}

.main-content {
  flex: 1;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style>