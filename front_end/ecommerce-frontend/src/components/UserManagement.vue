<!-- /components/UserManagement.vue -->
<template>
  <div class="user-management">
    <div class="dashboard-header">
      <h1 class="text-center text-2xl font-bold text-gray-800">User Management</h1>
    </div>

    <div class="filters-container">
      <div class="filters">
        <div class="filter-group">
          <label>
            <input type="checkbox" v-model="showUsers" />
            Show Users
          </label>
        </div>
        <div class="filter-group">
          <label>
            <input type="checkbox" v-model="showSellers" />
            Show Sellers
          </label>
        </div>
        <div class="filter-group">
          <label>
            <input type="checkbox" v-model="showPendingSellers" />
            Show Pending Sellers
          </label>
        </div>

        <div class="filter-group">
          <label>Search:</label>
          <input
            v-model="searchQuery"
            placeholder="Search by Username or Email"
            class="search-input"
          />
        </div>

        <div class="filter-group">
          <label>Sort By:</label>
          <select v-model="sortBy" class="sort-select">
            <option value="username">Username (Asc)</option>
            <option value="-username">Username (Desc)</option>
            <option value="createdAt">Registration Date (Oldest First)</option>
            <option value="-createdAt">Registration Date (Newest First)</option>
          </select>
        </div>
      </div>
    </div>

    <div class="table-container">
      <table class="users-table">
        <thead>
          <tr>
            <th class="username">Username</th>
            <th class="email">Email</th>
            <th class="role">Role</th>
            <th class="created-at">Registered On</th>
            <th class="actions">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td class="username">{{ user.username }}</td>
            <td class="email">{{ user.email }}</td>
            <td class="role">
              <span class="role-badge">{{ user.role }}</span>
            </td>
            <td class="created-at">{{ formatDate(user.createdAt) }}</td>
            <td class="actions">
              <div class="action-buttons">
                <!-- Approve Pending Seller -->
                <button
                  v-if="user.role === 'pending_seller'"
                  @click="approveSeller(user.id)"
                  class="action-button approve"
                >
                  Approve
                </button>
                <!-- Reject Pending Seller -->
                <button
                  v-if="user.role === 'pending_seller'"
                  @click="rejectSeller(user.id)"
                  class="action-button reject"
                >
                  Reject
                </button>
                <!-- Delete User/Seller -->
                <button
                  @click="deleteUser(user.id)"
                  class="action-button delete"
                >
                  Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="filteredUsers.length === 0" class="no-results">
        No users found matching your criteria.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserManagementStore } from '@/stores/userManagementStore';
import { toast } from 'vue3-toastify';

const userManagementStore = useUserManagementStore();

const showUsers = ref(true);
const showSellers = ref(true);
const showPendingSellers = ref(true);
const searchQuery = ref('');
const sortBy = ref('username');

onMounted(async () => {
  await userManagementStore.fetchUsers();
});

const filteredUsers = computed(() => {
  let users = userManagementStore.users || [];

  // Apply filters
  users = users.filter(user => {
    if (showUsers.value && user.role === 'user') return true;
    if (showSellers.value && user.role === 'seller') return true;
    if (showPendingSellers.value && user.role === 'pending_seller') return true;
    return false;
  });

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    users = users.filter(user =>
      user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  }

  // Apply sorting
  const [field, order] = sortBy.value.startsWith('-')
    ? [sortBy.value.slice(1), 'desc']
    : [sortBy.value, 'asc'];

  return users.sort((a, b) => {
    if (order === 'asc') {
      return a[field] > b[field] ? 1 : -1;
    }
    return a[field] < b[field] ? 1 : -1;
  });
});

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString();
}

async function approveSeller(userId) {
  try {
    await userManagementStore.approveSeller(userId);
    toast.success('Seller approved successfully');
  } catch (error) {
    toast.error('Failed to approve seller');
  }
}

async function rejectSeller(userId) {
  try {
    await userManagementStore.rejectSeller(userId);
    toast.success('Seller rejected successfully');
  } catch (error) {
    toast.error('Failed to reject seller');
  }
}

async function deleteUser(userId) {
  try {
    await userManagementStore.deleteUser(userId);
    toast.success('User deleted successfully');
  } catch (error) {
    toast.error('Failed to delete user');
  }
}
</script>

<style scoped>
.user-management {
  padding: 2rem;
  max-width: 1300px;
  margin: 0 auto;
}

.dashboard-header {
  margin-bottom: 2rem;
}

.filters-container {
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 0.5rem;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-input {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  width: 200px;
}

.sort-select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.table-container {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #d1d5db;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem;
  border-right: 1px solid #d1d5db;
  border-bottom: 1px solid #d1d5db;
}

.users-table th:last-child,
.users-table td:last-child {
  border-right: none;
}

.users-table th {
  background: #f8fafc;
  font-weight: 600;
  text-align: left;
  border-bottom: 2px solid #9ca3af;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 500;
  background: #e2e8f0;
  color: #1e293b;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background 0.2s;
}

.action-button.approve {
  background: #10b981;
  color: white;
}

.action-button.approve:hover {
  background: #059669;
}

.action-button.reject {
  background: #ef4444;
  color: white;
}

.action-button.reject:hover {
  background: #dc2626;
}

.action-button.delete {
  background: #64748b;
  color: white;
}

.action-button.delete:hover {
  background: #475569;
}

.no-results {
  padding: 2rem;
  text-align: center;
  color: #64748b;
}
</style>