<!-- /components/PaymentPage.vue -->
<template>
  <div class="max-w-4xl mx-auto py-8 px-4 md:px-8">
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-800 py-4 px-6">
        <h2 class="text-xl md:text-2xl font-bold text-white">Order Summary</h2>
      </div>

      <div class="p-6">
        <!-- Cart Items -->
        <div class="space-y-3 mb-6">
          <div v-for="item in cartStore.items" :key="item.id" 
               class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
            <div class="flex items-center">
              <span class="font-medium text-gray-800">{{ item.name }}</span>
              <span class="ml-2 text-sm text-gray-500">× {{ item.quantity }}</span>
            </div>
            <span class="font-semibold text-gray-900">${{ (item.price * item.quantity).toFixed(2) }}</span>
          </div>
        </div>

        <!-- Totals -->
        <div class="space-y-2 mb-6 bg-gray-50 p-4 rounded-lg">
          <div class="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${{ shipping.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${{ tax.toFixed(2) }}</span>
          </div>
          <div class="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
            <span>Total</span>
            <span class="text-blue-700">${{ total.toFixed(2) }}</span>
          </div>
        </div>

        <!-- Shipping Details -->
        <div v-if="selectedAddress" class="mb-6 bg-gray-50 p-4 rounded-lg">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-lg font-semibold text-gray-800">Shipping Information</h3>
            <button @click="changeAddress" 
                    class="text-sm text-blue-600 hover:text-blue-800 flex items-center transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Change
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-600">
            <p v-if="selectedAddress.fullName" class="flex items-start">
              <span class="text-gray-500 mr-2 w-20">Name:</span>
              <span class="font-medium text-gray-800">{{ selectedAddress.fullName }}</span>
            </p>
            <p v-if="selectedAddress.email" class="flex items-start">
              <span class="text-gray-500 mr-2 w-20">Email:</span>
              <span class="font-medium text-gray-800">{{ selectedAddress.email }}</span>
            </p>
            <p v-if="selectedAddress.phoneNumber" class="flex items-start">
              <span class="text-gray-500 mr-2 w-20">Phone:</span>
              <span class="font-medium text-gray-800">{{ selectedAddress.phoneNumber }}</span>
            </p>
            <p v-if="selectedAddress.addressLine1" class="flex items-start col-span-full">
              <span class="text-gray-500 mr-2 w-20">Address:</span>
              <span class="font-medium text-gray-800">
                {{ selectedAddress.addressLine1 }}
                {{ selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : '' }}
              </span>
            </p>
            <p v-if="selectedAddress.city || selectedAddress.state || selectedAddress.postalCode" class="flex items-start col-span-full">
              <span class="text-gray-500 mr-2 w-20"></span>
              <span class="font-medium text-gray-800">
                {{ selectedAddress.city }}, {{ selectedAddress.state }} {{ selectedAddress.postalCode }}
              </span>
            </p>
            <p v-if="selectedAddress.country" class="flex items-start">
              <span class="text-gray-500 mr-2 w-20">Country:</span>
              <span class="font-medium text-gray-800">{{ selectedAddress.country }}</span>
            </p>
          </div>
        </div>

        <!-- Payment Method -->
        <div class="mb-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
          <div id="paypal-button-container" class="w-full"></div>
        </div>
      </div>
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
  
  const paypalScript = document.createElement('script');
  paypalScript.src = "https://www.paypal.com/sdk/js?client-id=AceJUHWaafcPScT9WEkm0eDlocn_7QBvYEH2xHX0dOIcqCIopSWz9WaQYzglzSuD0XNmtLQ5sAXkuC9c";
  paypalScript.onload = loadPayPalButton;
  document.body.appendChild(paypalScript);
});
</script>