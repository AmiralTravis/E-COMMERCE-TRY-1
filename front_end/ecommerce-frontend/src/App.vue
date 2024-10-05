<!-- <template>
  <div id="app">
    <HeaderFrontend @open-auth-popup="openAuthPopup" />
    <div class="main-content">
      <router-view />
    </div>
    <FooterFrontend />
    <AuthPopup :isOpen="isAuthPopupOpen" @close="closeAuthPopup" />
  </div>
</template>

<script>
import FooterFrontend from './components/FooterFrontend.vue';
import HeaderFrontend from './components/HeaderFrontend.vue';
import AuthPopup from './components/AuthPopup.vue';

export default {
  name: 'App',
  components: {
    FooterFrontend,
    HeaderFrontend,
    AuthPopup,
  },
  data() {
    return {
      isAuthPopupOpen: false
    };
  },
  methods: {
    openAuthPopup() {
      this.isAuthPopupOpen = true;
    },
    closeAuthPopup() {
      this.isAuthPopupOpen = false;
    }
  },
  created() {
    if (this.$store.getters['auth/isAuthenticated']) {
      console.log('User is authenticated');
    }
  }
};
</script>

<style>
/* Ensure the body and html take up the full height */
html, body {
  height: 100%;
  margin: 0;
}

/* Style the root element */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Full viewport height */
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0; /* Remove default margin */
}

.main-content {
  flex: 1; /* Take up remaining space */
  padding: 0 20px; /* Add some horizontal padding if needed */
}

header {
  background-color: #f8f9fa; /* Light background color for header */
}

footer {
  background-color: #f8f9fa; /* Light background color for footer */
  height: 60px; /* Adjust height as needed */
  line-height: 60px; /* Center text vertically */
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 10px; /* Adjust padding for smaller screens */
  }
}
</style>

 -->



<!-- 
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
import { defineComponent } from 'vue';
import FooterFrontend from './components/FooterFrontend.vue';
import HeaderFrontend from './components/HeaderFrontend.vue';

export default defineComponent({
  name: 'App',
  components: {
    FooterFrontend,
    HeaderFrontend,
  },
  created() {
    // Check authentication status when app is created
    this.$store.dispatch('auth/checkAuth');
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
<!-- 
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
import { defineComponent } from 'vue';
import { useAuthStore } from './stores/auth';
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
    
    // Check authentication status when app is created
    authStore.checkAuth();
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
    
    onMounted(async () => {
      try {
        await authStore.checkAuth();
      } catch (error) {
        console.error('Error checking authentication:', error);
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