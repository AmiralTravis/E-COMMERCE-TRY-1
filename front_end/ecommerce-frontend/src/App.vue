<template>
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


















































<!-- 
<template>
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
import { mapActions } from 'vuex';
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
    ...mapActions('auth', ['checkAuth']),
    openAuthPopup() {
      this.isAuthPopupOpen = true;
    },
    closeAuthPopup() {
      this.isAuthPopupOpen = false;
    }
  },
  created() {
    this.checkAuth();
    if (this.$store.getters['auth/isAuthenticated']) {
      console.log('User is authenticated');
    } else {
      console.log('User is not authenticated');
    }
  },
  watch: {
    '$store.state.auth.authStatus': {
      handler(newStatus) {
        console.log('Auth status changed:', newStatus);
      },
      deep: true
    }
  }
};
</script>

<style>
/* Styles remain unchanged */
html, body {
  height: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}

.main-content {
  flex: 1;
  padding: 0 20px;
}

header {
  background-color: #f8f9fa;
}

footer {
  background-color: #f8f9fa;
  height: 60px;
  line-height: 60px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 10px;
  }
}
</style> -->
<!-- 


<template>
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
import { mapActions, mapGetters } from 'vuex';
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
  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'currentUser'])
  },
  methods: {
    ...mapActions('auth', ['checkAuth']),
    openAuthPopup() {
      this.isAuthPopupOpen = true;
    },
    closeAuthPopup() {
      this.isAuthPopupOpen = false;
    }
  },
  created() {
    this.checkAuth();
    console.log('Initial auth state:', this.isAuthenticated ? 'Authenticated' : 'Not authenticated');
  },
  watch: {
    isAuthenticated(newValue) {
      console.log('Authentication status changed:', newValue ? 'Authenticated' : 'Not authenticated');
      if (newValue) {
        console.log('Current user:', this.currentUser);
      }
    }
  }
};
</script>

<style>
/* Styles remain unchanged */
html, body {
  height: 100%;
  margin: 0;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0;
}

.main-content {
  flex: 1;
  padding: 0 20px;
}

header {
  background-color: #f8f9fa;
}

footer {
  background-color: #f8f9fa;
  height: 60px;
  line-height: 60px;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 10px;
  }
}
</style> -->