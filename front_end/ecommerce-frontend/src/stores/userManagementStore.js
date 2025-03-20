import { defineStore } from 'pinia';
import api from '@/services/api';

export const useUserManagementStore = defineStore('userManagement', {
  state: () => ({
    users: [],
  }),
  actions: {
    async fetchUsers() {
      const response = await api.get('/admin/users');
      this.users = response.data;
    },
    async approveSeller(userId) {
      await api.patch(`/admin/users/${userId}/approve`);
      await this.fetchUsers();
    },
    async rejectSeller(userId) {
      await api.delete(`/admin/users/${userId}/reject`);
      await this.fetchUsers();
    },
    async deleteUser(userId) {
      await api.delete(`/admin/users/${userId}`);
      await this.fetchUsers();
    },
  },
});