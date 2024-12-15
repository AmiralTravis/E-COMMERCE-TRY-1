<!-- components/UserProfile.vue -->

<template>
  <div class="profile-container">
    <h1>My Profile</h1>
    <div class="profile-content">
      <div class="profile-info">
        <h2>Personal Information</h2>
        <p>Username: {{ username }}</p>
        <p>Email: {{ email }}</p>
        <p>Phone Number: {{ phoneNumber }}</p>
      </div>

      <div class="saved-addresses">
        <h2>Saved Addresses</h2>
        <div v-if="addresses.length === 0">
          No saved addresses
        </div>
        <div v-for="address in addresses" :key="address.id" class="address-card">
          <p>{{ address.fullName }}</p>
          <p>{{ address.addressLine1 }}</p>
          <p>{{ address.city }}, {{ address.postalCode }}</p>
          <p>{{ address.state }} - {{ address.country }}</p> <!-- Show state and country -->
          <p>Email: {{ address.email }}</p> <!-- Display email -->
          <p>Phone: {{ address.phoneNumber }}</p> <!-- Display phone number -->
          
          <button 
            @click="setDefaultAddress(address.id)"
            :disabled="address.isDefault"
          >
            {{ address.isDefault ? 'Default Address' : 'Set as Default' }}
          </button>

          <!-- Add Edit Button -->
          <button 
            @click="editAddress(address)"
          >
            Edit Address
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Address Form -->
    <div v-if="editingAddress" class="edit-address-form">
      <h3>Edit Address</h3>
      <form @submit.prevent="updateAddress">
        <label for="fullName">Full Name:</label>
        <input type="text" v-model="addressForm.fullName" required>

        <label for="addressLine1">Address Line 1:</label>
        <input type="text" v-model="addressForm.addressLine1" required>

        <label for="addressLine2">Address Line 2:</label>
        <input type="text" v-model="addressForm.addressLine2">

        <label for="city">City:</label>
        <input type="text" v-model="addressForm.city" required>

        <label for="state">State:</label>
        <input type="text" v-model="addressForm.state" required>

        <label for="postalCode">Postal Code:</label>
        <input type="text" v-model="addressForm.postalCode" required>

        <label for="country">Country:</label>
        <input type="text" v-model="addressForm.country" required>

        <label for="email">Email:</label>
        <input type="email" v-model="addressForm.email" required>

        <label for="phoneNumber">Phone Number:</label>
        <input type="text" v-model="addressForm.phoneNumber" required>

        <button type="submit">Update Address</button>
        <button type="button" @click="cancelEdit">Cancel</button>
      </form>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

export default defineComponent({
  name: 'UserProfile',
  setup() {
    const authStore = useAuthStore();
    const addresses = ref([]);
    const username = ref(authStore.user?.username || '');
    const email = ref(authStore.user?.email || '');
    const phoneNumber = ref(authStore.user?.phoneNumber || '');

    // Edit form and address state
    const editingAddress = ref(false);
    const addressForm = ref({
      id: null,
      fullName: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      email: '',
      phoneNumber: ''
    });

    // Fetch addresses along with all necessary data
    const fetchAddresses = async () => {
      try {
        const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
        addresses.value = response.data;
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    // Set a new default address
    const setDefaultAddress = async (addressId) => {
      try {
        // Find the address to update from the list of fetched addresses
        const addressToUpdate = addresses.value.find(address => address.id === addressId);

        await api.post('/addresses/save-address', {
          userId: authStore.user.id,
          isDefault: true,
          id: addressId,
          fullName: addressToUpdate.fullName,
          email: addressToUpdate.email,
          phoneNumber: addressToUpdate.phoneNumber,
          addressLine1: addressToUpdate.addressLine1,
          addressLine2: addressToUpdate.addressLine2,
          city: addressToUpdate.city,
          state: addressToUpdate.state,
          postalCode: addressToUpdate.postalCode,
          country: addressToUpdate.country
        });

        await fetchAddresses(); // Refresh addresses after setting default
      } catch (error) {
        console.error('Error setting default address:', error);
      }
    };

    // Start editing an address
    const editAddress = (address) => {
      addressForm.value = { ...address };
      editingAddress.value = true;
    };

    // Update the address
    const updateAddress = async () => {
      try {
        await api.post('/addresses/save-address', {
          userId: authStore.user.id,
          id: addressForm.value.id,
          fullName: addressForm.value.fullName,
          email: addressForm.value.email,
          phoneNumber: addressForm.value.phoneNumber,
          addressLine1: addressForm.value.addressLine1,
          addressLine2: addressForm.value.addressLine2,
          city: addressForm.value.city,
          state: addressForm.value.state,
          postalCode: addressForm.value.postalCode,
          country: addressForm.value.country,
          isDefault: addressForm.value.isDefault || false
        });

        await fetchAddresses(); // Refresh addresses after update
        cancelEdit(); // Close the edit form
      } catch (error) {
        console.error('Error updating address:', error);
      }
    };

    // Cancel editing an address
    const cancelEdit = () => {
      editingAddress.value = false;
      addressForm.value = {
        id: null,
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        email: '',
        phoneNumber: ''
      };
    };

    // Fetch addresses on component mount
    onMounted(fetchAddresses);

    return {
      username,
      email,
      phoneNumber,
      addresses,
      editingAddress,
      addressForm,
      setDefaultAddress,
      editAddress,
      updateAddress,
      cancelEdit
    };
  }
});
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-info {
  margin-top: 1rem;
}

h1 {
  margin-bottom: 2rem;
}

h2 {
  color: #333;
  margin-bottom: 1rem;
}

.address-card {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.edit-address-form {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.edit-address-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.edit-address-form input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.edit-address-form button {
  background-color: #28a745;
}

.edit-address-form button[type="button"] {
  background-color: #dc3545;
}
</style>
