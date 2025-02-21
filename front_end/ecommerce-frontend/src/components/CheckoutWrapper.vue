<!-- /components/CheckoutWrapper.vue -->
<template>
  <div class="checkout-flow">
    <router-view
      :saved-addresses="addresses"
      :selected-address="selectedAddress"
      @address-selected="handleAddressSelected"
      @cancel="$router.push('/cart')"
      @refresh="loadAddresses"
      @update-address="handleUpdateAddress"
      @delete-address="handleDeleteAddress"
      @new-address="handleNewAddress"
      @set-default="handleSetDefault"
      @confirm="handleConfirm" 
    />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';
import api from '../services/api';

export default {
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    const addresses = ref([]);
    const selectedAddress = ref(null);

    const loadAddresses = async () => {
      try {
        const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
        addresses.value = response.data;
        selectedAddress.value = addresses.value.find(address => address.isDefault);
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    };

    const handleAddressSelected = (address) => {
      selectedAddress.value = address;
    };


const handleConfirm = (selectedAddress) => {
  if (selectedAddress) {
    // Store in sessionStorage for persistence
    sessionStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
    
    router.push({
      path: '/checkout/payment',
      state: { selectedAddress }
    });
  }
};

   
    const handleUpdateAddress = async (updatedAddress) => {
  try {
    // Use PUT request to update by address ID
    await api.put(`/addresses/${updatedAddress.id}`, updatedAddress);
    await loadAddresses(); // Refresh the address list
  } catch (error) {
    console.error('Error updating address:', error);
  }
};

    const handleDeleteAddress = async (addressId) => {
      try {
        await api.delete(`/addresses/${addressId}`);
        await loadAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    };

    const handleNewAddress = async (newAddress) => {
      try {
        await api.post('/addresses/save-address', { // Use POST /save-address
          ...newAddress,
          userId: authStore.user.id,
          isDefault: addresses.value.length === 0 // Set isDefault for new address only
        });
        await loadAddresses(); // Reload addresses to reflect changes.
      } catch (error) {
        console.error('Error adding new address:', error);
      }
    };

    
    const handleSetDefault = async (addressId) => {
  try {
    const addressToUpdate = addresses.value.find(address => address.id === addressId);
    const { id,...addressDataWithoutId } = addressToUpdate; // Remove id
    await api.post('/addresses/save-address', {
    ...addressDataWithoutId, // Spread without id
      userId: authStore.user.id,
      isDefault: true,
    });
    await loadAddresses();
  } catch (error) {
    console.error('Error setting default address:', error);
  }
};

    onMounted(async () => {
      if (authStore.isAuthenticated) {
        await loadAddresses();
      }
    });

    return {
      addresses,
      selectedAddress,
      loadAddresses,
      handleAddressSelected,
      handleUpdateAddress,
      handleDeleteAddress,
      handleNewAddress,
      handleSetDefault,
      handleConfirm // Expose handleConfirm
    };
  },




beforeRouteEnter(to, from, next) {
  const authStore = useAuthStore();

  authStore.checkAuth().then((isAuthenticated) => {
    if (!isAuthenticated) {
      next('/login?redirect=' + encodeURIComponent(to.path));
      return;
    }

    // Only check addresses when specifically entering from cart
    if (from.path === '/cart' && to.path === '/checkout/address') {
      api.get(`/addresses/user-addresses/${authStore.user.id}`)
        .then(response => {
          const hasSelection = sessionStorage.getItem('selectedAddress');
          const defaultAddress = response.data.find(a => a.isDefault);
          
          // Only redirect if no existing selection
          defaultAddress && !hasSelection ? next('/checkout/payment') : next();
        })
        .catch(() => next());
    } else {
      next();
    }
  }).catch(() => {
    next('/login?redirect=/checkout/address');
  });
}

};
</script>

<style scoped>
.checkout-flow {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
</style>