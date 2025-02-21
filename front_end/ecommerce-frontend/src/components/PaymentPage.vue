<!-- /components/PaymentPage.vue -->
<template>
  <div class="payment-page">
    <div class="order-summary">
      <h2>Order Summary</h2>

      <!-- Cart Items -->
      <div class="summary-items">
        <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
          <span>{{ item.name }} x {{ item.quantity }}</span>
          <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
      </div>

      <!-- Totals -->
      <div class="summary-totals">
        <div class="summary-row">
          <span>Subtotal</span>
          <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping</span>
          <span>${{ shipping.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Tax</span>
          <span>${{ tax.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Shipping Details -->
      <div v-if="selectedAddress" class="shipping-details">
        <h3>Shipping Information</h3>
        <div class="shipping-info">
          <p v-if="selectedAddress.fullName"><strong>Name:</strong> {{ selectedAddress.fullName }}</p>
          <p v-if="selectedAddress.email"><strong>Email:</strong> {{ selectedAddress.email }}</p>
          <p v-if="selectedAddress.phoneNumber"><strong>Phone:</strong> {{ selectedAddress.phoneNumber }}</p>
          <p v-if="selectedAddress.addressLine1">
            <strong>Address:</strong> {{ selectedAddress.addressLine1 }}
            {{ selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : '' }}
          </p>
          <p v-if="selectedAddress.city || selectedAddress.state || selectedAddress.postalCode">
            {{ selectedAddress.city }},
            {{ selectedAddress.state }}
            {{ selectedAddress.postalCode }}
          </p>
          <p v-if="selectedAddress.country"><strong>Country:</strong> {{ selectedAddress.country }}</p>
        </div>
        <button @click="changeAddress" class="change-address-btn">Change Address</button>
      </div>

      <!-- PayPal Button -->
      <div id="paypal-button-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

const cartStore = useCartStore();
const authStore = useAuthStore();
const router = useRouter();

const shippingDetails = ref(null);
const addresses = ref([]);
const selectedAddress = ref(null);
const loadedFromStorage = ref(false);


// Use cart store getters for shipping, tax, and total
const shipping = computed(() => cartStore.shipping);
const tax = computed(() => cartStore.tax);
const total = computed(() => cartStore.total);

// Fetch addresses and set the default selected address
// const fetchAddresses = async () => {
//   try {
//     const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
//     addresses.value = response.data;
//     selectedAddress.value = addresses.value.find(address => address.isDefault);
//   } catch (error) {
//     console.error('Error fetching addresses:', error);
//   }
// };
const fetchAddresses = async () => {
  if (loadedFromStorage.value) return;
  
  try {
    const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
    addresses.value = response.data;
  } catch (error) {
    console.error('Error fetching addresses:', error);
  }
};

// Navigate back to the address selection page
const changeAddress = () => {
  router.push('/checkout/address');
};

// Create the order in the backend before PayPal starts
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
      totalAmount: cartStore.total, // Use the total including shipping and tax
      shippingDetails: shippingDetails.value
    });

    return response.data.id; // Return the order ID
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
};

// Load PayPal button and set up payment flow
const loadPayPalButton = () => {
  window.paypal.Buttons({
    createOrder: async (data, actions) => {
      const orderId = await handleSubmit(); // Create order in backend
      if (!orderId) {
        alert('Failed to create order. Please try again.');
        return;
      }
      // Pass the order ID to PayPal for payment processing
      return actions.order.create({
        purchase_units: [{
          amount: { 
            currency_code: 'USD', // Add currency_code here
            value: total.value.toFixed(2), // Include shipping and tax
            breakdown: {
              item_total: { 
                currency_code: 'USD', // Add currency_code here
                value: cartStore.totalPrice.toFixed(2) // Subtotal
              },
              shipping: { 
                currency_code: 'USD', // Add currency_code here
                value: shipping.value.toFixed(2) // Shipping
              },
              tax_total: { 
                currency_code: 'USD', // Add currency_code here
                value: tax.value.toFixed(2) // Tax
              }
            }
          }
        }]
      });
    },

    onApprove: async (data, actions) => {
      try {
        // First capture the payment
        await actions.order.capture();
        
        // Then verify with your backend
        await api.post('/paypal/verify-order', {
          orderId: data.orderID,
          totalAmount: parseFloat(total.value.toFixed(2)) // Use the total including shipping and tax
        });

        // Try to clear the cart
        await cartStore.clearCart();

        // Navigate to success page
        router.push('/order-success');
      } catch (error) {
        console.error('Payment Error:', error);
        alert('Payment failed. Please try again.');
      }
    },

    onError: (err) => {
      console.error('PayPal Checkout Error:', err);
      alert('There was an error with PayPal checkout. Please try again.');
    }
  }).render('#paypal-button-container');
};






// Keep selected address in sessionStorage until explicitly cleared
onMounted(() => {
  const routeState = router.currentRoute.value.state;
  const storedAddress = sessionStorage.getItem('selectedAddress');

  if (routeState?.selectedAddress) {
    sessionStorage.setItem('selectedAddress', JSON.stringify(routeState.selectedAddress));
    selectedAddress.value = routeState.selectedAddress;
  } else if (storedAddress) {
    selectedAddress.value = JSON.parse(storedAddress);
  } else {
    fetchAddresses().then(() => {
      selectedAddress.value = addresses.value.find(a => a.isDefault);
    });
  }
});

// Clear storage when leaving payment page
onBeforeUnmount(() => {
  if (!router.currentRoute.value.path.includes('/checkout/payment')) {
    sessionStorage.removeItem('selectedAddress');
  }
});

onMounted(async () => {
  await cartStore.fetchCart();
  // await fetchAddresses();

  const paypalScript = document.createElement('script');
  paypalScript.src = "https://www.paypal.com/sdk/js?client-id=AceJUHWaafcPScT9WEkm0eDlocn_7QBvYEH2xHX0dOIcqCIopSWz9WaQYzglzSuD0XNmtLQ5sAXkuC9c";
  paypalScript.onload = loadPayPalButton;
  document.body.appendChild(paypalScript);
});
</script>

<style scoped>
.payment-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  gap: 2rem;
  background-color: #f8f9fa;
}

.order-summary {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  width: 100%;
  transition: all 0.3s ease;
}

.summary-items {
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #495057;
}

.summary-totals {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  color: #343a40;
}

.summary-row.total {
  font-weight: bold;
  color: #212529;
  border-top: 2px solid #dee2e6;
  padding-top: 0.5rem;
}

#paypal-button-container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

h2 {
  color: #343a40;
  margin-bottom: 1rem;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.change-address-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .payment-page {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
}
</style>