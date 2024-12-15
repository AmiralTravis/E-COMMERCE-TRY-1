<!-- components/CheckoutFrontend.vue -->

<!-- <template>
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

    <div v-else class="checkout-content"> -->
      <!-- Conditionally render address form if no default address exists -->
      <!-- <div v-if="!hasDefaultAddress" class="checkout-form">
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

      <div class="order-summary">
        <h2>Order Summary</h2>
        <div class="summary-items">
          <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
            <span>{{ item.name }} x {{ item.quantity }}</span>
            <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>
        <div class="summary-totals">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping</span>
            <span>${{ shipping.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
        </div> -->

        <!-- PayPal Button -->
        <!-- <div id="paypal-button-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
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

    const shipping = computed(() => (cartStore.totalPrice > 100 ? 0 : 10));
    const total = computed(() => cartStore.totalPrice + shipping.value);

    

    const checkDefaultAddress = async () => {
      try {
        const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
        if (response.data.some(addr => addr.isDefault)) {
          // If default address exists, get the latest order and go to payment
          const latestOrder = await handleSubmit();
          router.push({ 
            name: 'PaymentPage', 
            query: { orderId: latestOrder } 
          });
        }
      } catch (error) {
        console.error('Error checking addresses:', error);
      }
    };
    

    const saveAddress = async () => {
      try {
        // Always save address, but set isDefault to false
        await api.post('/addresses/save-address', {
          ...formData.value,
          isDefault: false
        });

        // Navigate to payments page
        router.push({
          name: 'PaymentPage',
          query: { orderId: await handleSubmit() }
        });
      } catch (error) {
        console.error('Address save or order submission failed:', error);
      }
    };

    const handleSubmit = async () => {
      try {
        if (cartStore.items.length === 0) {
          throw new Error('Cannot submit order with an empty cart');
        }

        const response = await api.post('/orders', {
          items: cartStore.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: total.value,
          shippingDetails: formData.value
        });

        return response.data;
      } catch (error) {
        console.error('Error creating order:', error);
        return null;
      }
    };

    const loadPayPalButton = () => {
      window.paypal.Buttons({
        createOrder: async (data, actions) => {
          const order = await handleSubmit();
          if (!order) throw new Error('Failed to create order');

          return actions.order.create({
            purchase_units: [{
              amount: { value: total.value.toFixed(2) }
            }]
          });
        },

        onApprove: async (data, actions) => {
          try {
            await actions.order.capture();
            await api.post('/paypal/verify-order', {
              orderID: data.orderID,
              totalAmount: total.value
            });

            await cartStore.clearCart();
            router.push('/order-success');
          } catch (error) {
            console.error('Payment Error:', error);
            alert('Payment failed. Please try again.');
          }
        },

        onError: (err) => console.error('PayPal Checkout Error:', err)
      }).render('#paypal-button-container');
    };

    onMounted(async () => {
      await cartStore.fetchCart();
      await checkDefaultAddress();
      const paypalScript = document.createElement('script');
      paypalScript.src = "https://www.paypal.com/sdk/js?client-id=AceJUHWaafcPScT9WEkm0eDlocn_7QBvYEH2xHX0dOIcqCIopSWz9WaQYzglzSuD0XNmtLQ5sAXkuC9c";
      paypalScript.onload = loadPayPalButton;
      document.body.appendChild(paypalScript);
    });

    return { 
      formData, 
      cartStore, 
      shipping, 
      total, 
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
  
  .checkout-content {
    display: flex;
    gap: 40px;
  }
  
  .checkout-form {
    flex: 2;
  }
  
  .order-summary {
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
  
  .order-summary {
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: fit-content;
  }
  
  .summary-items {
    margin-bottom: 20px;
  }
  
  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .summary-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .total {
    font-weight: bold;
    font-size: 1.2em;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #ddd;
  }
  
  @media (max-width: 768px) {
    .checkout-content {
      flex-direction: column;
    }
  
    .form-row {
      flex-direction: column;
      gap: 0;
    }
  }
</style> -->


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
          const latestOrder = await handleSubmit();
          router.push({ 
            name: 'PaymentPage', 
            query: { orderId: latestOrder } 
          });
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

        router.push({
          name: 'PaymentPage',
          query: { orderId: await handleSubmit() }
        });
      } catch (error) {
        console.error('Address save or order submission failed:', error);
      }
    };

    const handleSubmit = async () => {
      try {
        if (cartStore.items.length === 0) {
          throw new Error('Cannot submit order with an empty cart');
        }

        const response = await api.post('/orders', {
          items: cartStore.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          })),
          totalAmount: cartStore.totalPrice,
          shippingDetails: formData.value
        });

        return response.data;
      } catch (error) {
        console.error('Error creating order:', error);
        return null;
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
