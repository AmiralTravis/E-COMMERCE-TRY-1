<!-- components/CheckoutFrontend.vue -->

<template>
  <div class="checkout-page">
    <h1>Checkout</h1>

    <div v-if="cartStore.loading" class="loading-message">
      Loading checkout data...
    </div>

    <div v-else-if="cartStore.error" class="error-message">
      {{ cartStore.error }}
    </div>

    <div v-else-if="cartStore.items.length === 0" class="empty-cart-message">
      Your cart is empty. Please add items before proceeding to checkout.
    </div>

    <div v-else class="checkout-content">
      <!-- Conditionally render address form if no default address exists -->
      <div v-if="!hasDefaultAddress" class="checkout-form">
        <form @submit.prevent="saveAddress">
          <section class="form-section">
            <h2>Shipping Information</h2>
            <div class="form-group">
              <label for="fullName">Full Name</label>
              <input 
                type="text" 
                id="fullName" 
                v-model="formData.fullName"
                required
              >
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                v-model="formData.email"
                required
              >
            </div>
            <div class="form-group">
              <label for="phoneNumber">Phone Number</label>
              <input 
                type="tel" 
                id="phoneNumber" 
                v-model="formData.phoneNumber"
                required
              >
            </div>
            <div class="form-group">
              <label for="addressLine1">Address Line 1</label>
              <input 
                type="text" 
                id="addressLine1" 
                v-model="formData.addressLine1"
                required
              >
            </div>
            <div class="form-group">
              <label for="addressLine2">Address Line 2 (Optional)</label>
              <input 
                type="text" 
                id="addressLine2" 
                v-model="formData.addressLine2"
              >
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  v-model="formData.city"
                  required
                >
              </div>
              <div class="form-group">
                <label for="state">State</label>
                <input 
                  type="text" 
                  id="state" 
                  v-model="formData.state"
                  required
                >
              </div>
              <div class="form-group">
                <label for="postalCode">Postal Code</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  v-model="formData.postalCode"
                  required
                >
              </div>
            </div>
            <div class="form-group">
              <label for="country">Country</label>
              <select id="country" v-model="formData.country" required>
                <option value="">Select a country</option>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option> 
              </select>
            </div>
            <div class="form-group">
              <label>
                <input 
                  type="checkbox" 
                  v-model="saveAsDefaultAddress"
                >
                Save this address for future orders
              </label>
            </div>
          </section>

          <button type="submit" class="submit-btn">
            Save Address and Continue
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

export default defineComponent({
  name: 'CheckoutFrontend',
  setup() {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const router = useRouter();
    const hasDefaultAddress = ref(false);
    const saveAsDefaultAddress = ref(false);

    const formData = ref({
      userId: authStore.user.id,
      fullName: '',
      email: '',
      phoneNumber: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    });

    const checkDefaultAddress = async () => {
      try {
        const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
        if (response.data.some(addr => addr.isDefault)) {
          // Order will be created in PaymentPage
          router.push({ name: 'PaymentPage' });
        }
      } catch (error) {
        console.error('Error checking addresses:', error);
      }
    };

    const saveAddress = async () => {
      try {
        await api.post('/addresses/save-address', {
          ...formData.value,
          isDefault: false
        });

        // Order will be created in PaymentPage
        router.push({ name: 'PaymentPage' });
      } catch (error) {
        console.error('Address save or order submission failed:', error);
      }
    };

    onMounted(async () => {
      await cartStore.fetchCart();
      await checkDefaultAddress();
    });

    return { 
      formData, 
      cartStore, 
      hasDefaultAddress,
      saveAsDefaultAddress,
      saveAddress 
    };
  }
});
</script>

<style scoped>
  .checkout-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .checkout-form {
    flex: 1;
  }
  
  .form-section {
    margin-bottom: 30px;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-row {
    display: flex;
    gap: 20px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
  
  input, select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .submit-btn {
    width: 100%;
    padding: 15px;
    background-color: #2ecc71;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1.1em;
  }
  
  @media (max-width: 768px) {
    .form-row {
      flex-direction: column;
      gap: 0;
    }
  }
</style>
