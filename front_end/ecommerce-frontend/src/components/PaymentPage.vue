<!-- components/PaymentPage.vue -->
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
          <div class="summary-row total">
            <span>Total</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
        </div>
  
        <!-- Shipping Details -->
        <div v-if="addresses.length > 0" class="shipping-details">
          <h3>Shipping Information</h3>
          <div class="shipping-info" v-for="address in addresses" :key="address.id">
            <p v-if="address.fullName"><strong>Name:</strong> {{ address.fullName }}</p>
            <p v-if="address.email"><strong>Email:</strong> {{ address.email }}</p>
            <p v-if="address.phoneNumber"><strong>Phone:</strong> {{ address.phoneNumber }}</p>
            <p v-if="address.addressLine1">
              <strong>Address:</strong> {{ address.addressLine1 }}
              {{ address.addressLine2 ? ', ' + address.addressLine2 : '' }}
            </p>
            <p v-if="address.city || address.state || address.postalCode">
              {{ address.city }}, 
              {{ address.state }} 
              {{ address.postalCode }}
            </p>
            <p v-if="address.country"><strong>Country:</strong> {{ address.country }}</p>
          </div>
        </div>
  
        <!-- PayPal Button -->
        <div id="paypal-button-container"></div>
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
  name: 'PaymentPage',
  setup() {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const router = useRouter();

    const shippingDetails = ref(null);
    const shipping = ref(cartStore.totalPrice > 100 ? 0 : 10);
    const total = ref(cartStore.totalPrice + shipping.value);

    const addresses = ref([]);
    
    const fetchAddresses = async () => {
      try {
        const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
        addresses.value = response.data;
      } catch (error) {
        console.error('Error fetching addresses:', error);
      }
    };

    const setDefaultAddress = async (addressId) => {
      try {
        await api.post('/addresses/save-address', {
          userId: authStore.user.id,
          isDefault: true,
          id: addressId
        });
        await fetchAddresses();
      } catch (error) {
        console.error('Error setting default address:', error);
      }
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
          totalAmount: cartStore.totalPrice,
          shippingDetails: shippingDetails.value
        });

        return response.data.id; // Return the order ID
      } catch (error) {
        console.error('Error creating order:', error);
        return null;
      }
    };

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
              amount: { value: total.value.toFixed(2) }
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
              totalAmount: parseFloat(total.value.toFixed(2))
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

    onMounted(async () => {
      await cartStore.fetchCart();
      await fetchAddresses(); // Fetch addresses on mount

      const paypalScript = document.createElement('script');
      paypalScript.src = "https://www.paypal.com/sdk/js?client-id=AceJUHWaafcPScT9WEkm0eDlocn_7QBvYEH2xHX0dOIcqCIopSWz9WaQYzglzSuD0XNmtLQ5sAXkuC9c";
      paypalScript.onload = loadPayPalButton;
      document.body.appendChild(paypalScript);
    });

    return { 
      cartStore, 
      shipping, 
      total,
      shippingDetails,
      addresses, 
      setDefaultAddress
    };
  }
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

/* .order-summary:hover {
  box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-5px);
} */

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

@media (max-width: 768px) {
  .payment-page {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
  }
}
</style>