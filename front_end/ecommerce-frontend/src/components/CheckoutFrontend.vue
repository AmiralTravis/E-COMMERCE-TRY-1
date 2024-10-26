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
      <div class="checkout-form">
        <form @submit.prevent="handleSubmit">
          <!-- Shipping Information -->
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
              <label for="address">Address</label>
              <input 
                type="text" 
                id="address" 
                v-model="formData.address"
                required
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
          </section>

          <button type="submit" class="submit-btn" :disabled="cartStore.loading">
            {{ cartStore.loading ? 'Processing...' : 'Place Order' }}
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
        </div>

        <!-- PayPal Button -->
        <div id="paypal-button-container"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';

export default defineComponent({
  name: 'CheckoutFrontend',
  setup() {
    const cartStore = useCartStore();
    const router = useRouter();

    const formData = ref({
      fullName: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    });

    // Compute shipping cost based on total price
    const shipping = computed(() => (cartStore.totalPrice > 100 ? 0 : 10));

    // Compute total cost as a number
    const total = computed(() => cartStore.totalPrice + shipping.value);

    const handleSubmit = async () => {
      try {
        if (cartStore.items.length === 0) {
          throw new Error('Cannot submit order with an empty cart');
        }

        // Log order details for submission
        console.log('Order submitted:', { 
          formData: formData.value, 
          orderTotal: total.value.toFixed(2), // Format as a string
          items: cartStore.items
        });

        // Call your backend API to save the order here if necessary

        await cartStore.clearCart();
        router.push('/order-success');
      } catch (error) {
        console.error('Error processing order:', error);
      }
    };

    // PayPal Button rendering logic
    const loadPayPalButton = () => {
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.value.toFixed(2) // Use the computed total value as a string
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then((details) => {
            alert('Transaction completed by ' + details.payer.name.given_name);
            handleSubmit(); // Call handleSubmit to clear cart and redirect
          });
        },
        onError: (err) => {
          console.error('PayPal Checkout Error:', err);
        }
      }).render('#paypal-button-container');
    };

    onMounted(async () => {
      await cartStore.fetchCart();

      // Ensure PayPal script is loaded
      const paypalScript = document.createElement('script');
      paypalScript.src = "https://www.paypal.com/sdk/js?client-id=AceJUHWaafcPScT9WEkm0eDlocn_7QBvYEH2xHX0dOIcqCIopSWz9WaQYzglzSuD0XNmtLQ5sAXkuC9c"; // Replace with your actual PayPal client ID
      paypalScript.onload = loadPayPalButton;
      document.body.appendChild(paypalScript);
    });

    return {
      formData,
      cartStore,
      shipping,
      total,
      handleSubmit
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
</style>
