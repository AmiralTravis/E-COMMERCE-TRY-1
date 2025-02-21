
<!-- src/App.vue -->

<template>
  <div id="app">
    <HeaderFrontend v-if="showHeaderAndFooter" />
    <SubHeader v-if="showHeaderAndFooter" />
    <div class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <FooterFrontend v-if="showHeaderAndFooter" />
  </div>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import FooterFrontend from './components/FooterFrontend.vue';
import HeaderFrontend from './components/HeaderFrontend.vue';
import SubHeader from './components/SubHeader.vue';

export default defineComponent({
  name: 'App',
  components: {
    FooterFrontend,
    HeaderFrontend,
    SubHeader,
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const route = useRoute();

    const showHeaderAndFooter = computed(() => {
      // Add the routes where you don't want to show the header and footer
      const excludedRoutes = ['Login', 'SignUp', 'ResetPassword', 'ForgotPassword'];
      return !excludedRoutes.includes(route.name);
    });

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

    return {
      showHeaderAndFooter,
    };
  },
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
  /* padding: 5px;  */
  max-width: 1600px;
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
<!-- 
<template>
  <div id="app">
    <HeaderFrontend v-if="showHeaderAndFooter" />
    <SubHeader v-if="showHeaderAndFooter" />
    <div class="main-content">
      <router-view />
    </div>
    <FooterFrontend v-if="showHeaderAndFooter" />
  </div>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import FooterFrontend from './components/FooterFrontend.vue';
import HeaderFrontend from './components/HeaderFrontend.vue';
import SubHeader from './components/SubHeader.vue';

export default defineComponent({
  name: 'App',
  components: {
    FooterFrontend,
    HeaderFrontend,
    SubHeader,
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const route = useRoute();

    const showHeaderAndFooter = computed(() => {
      // Add the routes where you don't want to show the header and footer
      const excludedRoutes = ['Login', 'SignUp'];
      return !excludedRoutes.includes(route.name);
    });

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

    return {
      showHeaderAndFooter,
    };
  },
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
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px;
  }
}
</style> -->

<!-- <template>
  <div id="app">
    <HeaderFrontend v-if="showHeaderAndFooter" />
    <SubHeader v-if="showHeaderAndFooter" />
    <div class="main-content">
      <router-view v-slot="{ Component, route }">
        <transition 
          name="fade" 
          mode="out-in"
          v-if="!isAuthPage(route)"
        >
          <component :is="Component" />
        </transition>
        <component 
          :is="Component"
          v-else
        />
      </router-view>
    </div>
    <FooterFrontend v-if="showHeaderAndFooter" />
  </div>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './stores/auth';
import { useCartStore } from './stores/cart';
import FooterFrontend from './components/FooterFrontend.vue';
import HeaderFrontend from './components/HeaderFrontend.vue';
import SubHeader from './components/SubHeader.vue';

export default defineComponent({
  name: 'App',
  components: {
    FooterFrontend,
    HeaderFrontend,
    SubHeader,
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const route = useRoute();

    const showHeaderAndFooter = computed(() => {
      const excludedRoutes = ['Login', 'SignUp'];
      return !excludedRoutes.includes(route.name);
    });

    const isAuthPage = (route) => {
      return ['Login', 'SignUp'].includes(route.name);
    };

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

    return {
      showHeaderAndFooter,
      isAuthPage,
    };
  },
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
  max-width: 1600px;
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