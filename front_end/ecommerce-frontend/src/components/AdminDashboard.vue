<!-- /components/AdminDashboard.vue -->

<template>
  <div class="admin-dashboard">
    <h1 class="text-centre text-2xl font-bold mb-6 text-gray-800">Admin Management</h1>

    

    <div v-if="loading" class="loading-message">Loading dashboard data...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <div v-else class="dashboard-content">
      

      <section v-if="isSuperAdmin" class="admin-management-section">
        <h2>Admin Role Management</h2>

        <div class="management-forms">
          <div class="form-section">
            <h3>Create New Admin</h3>
            <form @submit.prevent="createAdmin" class="admin-form">
              <input v-model="newAdmin.username" placeholder="Username" required class="form-input">
              <input v-model="newAdmin.email" type="email" placeholder="Email" required class="form-input">
              <input v-model="newAdmin.password" type="password" placeholder="Password" required class="form-input">
              <button type="submit" class="form-button">Create Admin</button>
            </form>
          </div>

          <div class="form-section">
            <h3>Promote Existing User to Admin</h3>
            <form @submit.prevent="promoteToAdmin" class="admin-form">
              <input v-model="userToPromote.email" type="email" placeholder="User Email" required class="form-input">
              <button type="submit" class="form-button">Promote to Admin</button>
            </form>
          </div>
        </div>

        <div class="superadmin-section">
          <h2>Superadmin-exclusive Function</h2>
          </div>

        <div class="admin-list">
          <h3>All Admins</h3>
          <ul>
            <li v-for="admin in allAdmins" :key="admin.id" class="admin-item">
              {{ admin.username }} - {{ admin.email }}
              <button v-if="isSuperAdmin" @click="removeAdmin(admin)" class="remove-button">Remove Admin</button>
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const authStore = useAuthStore();
const isSuperAdmin = computed(() => authStore.isSuperAdmin);

// State
const loading = ref(true);
const error = ref(null);
const newAdmin = ref({ username: '', email: '', password: '' });
const userToPromote = ref({ email: '' });
const allAdmins = ref([]);

// Fetch initial data
onMounted(async () => {
  try {
    await Promise.all([
      fetchAllAdmins(),
    ]);
  } catch (err) {
    error.value = 'Failed to load dashboard data. Please try again later.';
  } finally {
    loading.value = false;
  }
});


// Fetch all admins
async function fetchAllAdmins() {
  try {
    const response = await api.get('/admin/all-admins');
    allAdmins.value = response.data;
  } catch (err) {
    error.value = 'Failed to fetch admin list. Please try again later.';
  }
}

// Create new admin
async function createAdmin() {
  try {
    await api.post('/admin/create-admin', newAdmin.value);
    newAdmin.value = { username: '', email: '', password: '' }; // Reset form
    await fetchAllAdmins(); // Refresh admin list
  } catch (err) {
    error.value = 'Failed to create admin account. Please try again.';
  }
}

// Promote user to admin
async function promoteToAdmin() {
  try {
    await api.post('/admin/promote-to-admin', { email: userToPromote.value.email });
    userToPromote.value.email = ''; // Reset form
    await fetchAllAdmins(); // Refresh admin list
  } catch (err) {
    error.value = 'Failed to promote user to admin. Please verify the email address.';
  }
}

// Remove admin
async function removeAdmin(admin) {
  if (!isSuperAdmin.value) {
    error.value = 'Only superadmins can remove admins.';
    return;
  }

  try {
    const response = await api.post('/admin/remove-admin', {
      username: admin.username,
      email: admin.email,
    });
    if (response.data.success) {
      await fetchAllAdmins(); // Refresh admin list
    } else {
      error.value = response.data.message || 'Failed to remove admin. Please try again.';
    }
  } catch (err) {
    if (err.response && err.response.status === 400) {
      error.value = err.response.data.message || 'Invalid admin details. Please check the username and email.';
    } else {
      error.value = 'Failed to remove admin. Please try again later.';
    }
  }
}
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.dashboard-nav {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.nav-link {
  text-decoration: none;
  color: #4a5568;
  font-weight: bold;
  padding: 10px 15px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: #f0f0f0;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 20px;
  font-size: 1.2rem;
}

.error-message {
  color: #e53e3e;
}

.dashboard-content {
  display: grid;
  gap: 30px;
}

.low-stock-section,
.admin-management-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.low-stock-list {
  list-style: none;
  padding: 0;
}

.low-stock-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.no-alerts {
  color: #718096;
}



.management-forms {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

.form-section {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  padding: 8px 16px;
  background: #4a5568;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background: #2d3748;
}

.superadmin-section {
  margin-top: 40px;
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
}
</style>