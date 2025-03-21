  <!-- views/CartFrontend.-->
  
  <template>
    <div class="cart-page">
      <div class="cart-header">
        <h1>Shopping Cart</h1>
        <span class="item-count" v-if="cartItems.length > 0">
          {{ cartItems.length }} {{ cartItems.length === 1 ? 'item' : 'items' }}
        </span>
      </div>
  
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading your cart...</p>
      </div>
  
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <p>{{ error }}</p>
        <button @click="retryLoad" class="retry-btn">
          <span class="retry-icon">↻</span>
          Try Again
        </button>
      </div>
  
      <div v-else-if="cartItems.length === 0" class="empty-cart">
        <div class="empty-cart-illustration">🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <router-link to="/products" class="continue-shopping">
          Continue Shopping
        </router-link>
      </div>
  
      <div v-else class="cart-content">
        <div class="cart-items">
          <TransitionGroup name="list" tag="div">
            <div v-for="item in cartItems" 
                 :key="item.id" 
                 class="cart-item"
                 :class="{ 'removing': removingItems.includes(item.id) }">
              <!-- <div class="item-image-container">
                <img :src="`/api/placeholder/200/200`" :alt="item.name" class="item-image" />
              </div> -->
              <!-- <div class="item-image-container relative overflow-hidden p-3 rounded-t-xl h-64">
  <img :src="item.imageUrl" :alt="item.name" class="item-image" />
  <p v-if="item.imageUrl">Image URL: {{ item.imageUrl }}</p>
  <p v-else>Image URL: Not Available</p>
</div> -->
<div class="item-image-container relative overflow-hidden p-3 rounded-t-xl h-64 group">
  <img 
    :src="item.imageUrl" 
    :alt="item.name" 
    class="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
  />
  <div class="absolute inset-0 bg-black bg-opacity-10"></div>
</div>         
              <div class="item-details">
                <div class="item-info">
                  <!-- <h2>{{ item.name }}</h2> -->
                  <router-link 
  :to="`/products/${item.id}`" 
  class="cart-product-name"
>
  {{ item.name }}
</router-link>
                  <p class="item-price">${{ formatPrice(item.price) }}</p>
                </div>
  
                <div class="item-actions">
                  <div class="quantity-controls">
                    <button @click="decreaseQuantity(item)" 
                            class="quantity-btn"
                            :disabled="item.quantity <= 1 || loading">
                      −
                    </button>
                    <span class="quantity-display">{{ item.quantity }}</span>
                    <button @click="increaseQuantity(item)" 
                            class="quantity-btn"
                            :disabled="loading">
                      +
                    </button>
                  </div>
  
                  <button @click="removeFromCart(item.id)" 
                          class="remove-btn"
                          :disabled="loading">
                    Remove
                  </button>
                </div>
  
                <p class="item-subtotal">
                  Subtotal: <span>${{ formatPrice(item.price * item.quantity) }}</span>
                </p>
              </div>
            </div>
          </TransitionGroup>
        </div>
  
        <div class="cart-summary">
          <div class="summary-header">
            <h2>Order Summary</h2>
          </div>
  
          <div class="summary-content">
            <div class="summary-row">
              <span>Subtotal</span>
              <span>${{ formatPrice(subtotal) }}</span>
            </div>
  
            <div class="summary-row">
              <span>Shipping</span>
              <span v-if="shipping === 0" class="free-shipping">Free</span>
              <span v-else>${{ formatPrice(shipping) }}</span>
            </div>
  
            <div class="summary-row">
              <span>Tax</span>
              <span>${{ formatPrice(tax) }}</span>
            </div>
  
            <div class="shipping-message" v-if="subtotal < 100">
              Add ${{ formatPrice(100 - subtotal) }} more to get free shipping!
            </div>
  
            <div class="summary-total">
              <span>Total</span>
              <span>${{ formatPrice(total) }}</span>
            </div>
  
            <button @click="proceedToCheckout" 
                    class="checkout-btn"
                    :disabled="loading">
              Proceed to Checkout
            </button>
  
            <router-link to="/products" class="continue-shopping-link">
              Continue Shopping
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent, computed, onMounted, watch, ref } from 'vue';
  import { useCartStore } from '../stores/cart';
  import { useAuthStore } from '../stores/auth';
  import { useRouter } from 'vue-router';
  import api from '../services/api';

  
  export default defineComponent({
    name: 'CartFrontend',
    
    setup() {
      const cartStore = useCartStore();
      const authStore = useAuthStore();
      const router = useRouter();
      const error = ref(null);
      const loading = ref(false);
      const removingItems = ref([]);
  
      const formatPrice = (price) => {
        return typeof price === 'number' ? price.toFixed(2) : '0.00';
      };
  
      const loadCart = async () => {
        loading.value = true;
        error.value = null;
        try {
          await cartStore.fetchCart();
        } catch (err) {
          error.value = 'Failed to load cart. Please try again.';
          console.error('Cart loading error:', err);
        } finally {
          loading.value = false;
        }
      };
  
      onMounted(loadCart);
  
      watch(() => authStore.isAuthenticated, async (newValue) => {
        if (newValue) {
          await cartStore.syncLocalCartWithServer();
        }
      });
  
      // const cartItems = computed(() => cartStore.items || []);
      const cartItems = computed(() => {
    console.log('Cart Items:', cartStore.items);
    return cartStore.items || [];
  });
      const subtotal = computed(() => 
        cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0)
      );
      const shipping = computed(() => subtotal.value >= 100 ? 0 : 10);
      const tax = computed(() => subtotal.value * 0.08); // 8% tax rate
      const total = computed(() => subtotal.value + shipping.value + tax.value);
  
      const retryLoad = () => {
        loadCart();
      };
  
      const increaseQuantity = async (item) => {
        if (loading.value) return;
        
        loading.value = true;
        try {
          await cartStore.updateQuantity(item.id, item.quantity + 1);
        } catch (err) {
          console.error('Failed to increase quantity:', err);
        } finally {
          loading.value = false;
        }
      };
  
      const decreaseQuantity = async (item) => {
        if (loading.value || item.quantity <= 1) return;
  
        loading.value = true;
        try {
          await cartStore.updateQuantity(item.id, item.quantity - 1);
        } catch (err) {
          console.error('Failed to decrease quantity:', err);
        } finally {
          loading.value = false;
        }
      };
  
      const removeFromCart = async (cartItemId) => {
        if (loading.value) return;
  
        removingItems.value.push(cartItemId);
        loading.value = true;
        
        try {
          await cartStore.removeFromCart(cartItemId);
        } catch (err) {
          console.error('Failed to remove item:', err);
        } finally {
          loading.value = false;
          removingItems.value = removingItems.value.filter(id => id !== cartItemId);
        }
      };
  
      // const proceedToCheckout = () => {
      //   if (!authStore.isAuthenticated) {
      //     router.push('/login?redirect=/checkout');
      //     return;
      //   }
      //   router.push('/checkout');
      // };
//       const proceedToCheckout = () => {
//     if (!authStore.isAuthenticated) {
//         router.push('/login?redirect=/checkout/address'); // Redirect to /checkout/address
//         return;
//     }
//     router.push('/checkout/address'); // Push /checkout/address
// };
// const proceedToCheckout = async () => {
//   if (!authStore.isAuthenticated) {
//     router.push('/login?redirect=/checkout/address');
//     return;
//   }

//   try {
//     const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
//     const addresses = response.data;
//     const defaultAddress = addresses.find(address => address.isDefault);

//     if (defaultAddress) {
//       router.push('/checkout/payment');
//     } else {
//       router.push('/checkout/address');
//     }
//   } catch (error) {
//     console.error('Error fetching addresses:', error);
//     router.push('/checkout/address');
//   }
// };
const proceedToCheckout = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=/checkout/address');
    return;
  }

  // Direct to checkout flow - let navigation guards handle address checks
  router.push('/checkout/address');
};
      return {
        cartItems,
        subtotal,
        shipping,
        tax,
        total,
        loading,
        error,
        removingItems,
        formatPrice,
        retryLoad,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        proceedToCheckout,
        isAuthenticated: computed(() => authStore.isAuthenticated)
      };
    }
  });
  </script>

  <style scoped>
  .cart-page {
    max-width: 1300px;
    background-color: #ffffff;
    margin: 0 auto;
    padding: 2rem;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  }
  
  .cart-header {
    display: flex;
    align-items: center;
    margin-bottom: 2rem;
    gap: 1rem;
  }
  
  .cart-header h1 {
    font-size: 2rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
  }
  
  .item-count {
    color: #666;
    font-size: 1rem;
  }
  
  .loading-state {
    text-align: center;
    padding: 4rem;
    background: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    margin: 0 auto 1rem;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-state {
    text-align: center;
    padding: 4rem;
    background: #fff5f5;
    border-radius: 8px;
    color: #dc3545;
  }
  
  .error-icon {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .retry-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    font-size: 1rem;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    transition: background-color 0.2s;
  }
  
  .retry-btn:hover {
    background: #c82333;
  }
  
  .empty-cart {
    text-align: center;
    padding: 4rem;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .empty-cart-illustration {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
  
  .continue-shopping {
    display: inline-block;
    background: #3498db;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .continue-shopping:hover {
    background: #2980b9;
  }
  
  .cart-content {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 2rem;
  }
  
  .cart-items {
    background: rgb(255, 255, 255);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Bottom and sides shadow */
    /* 0 -2px 4px rgba(255, 255, 255, 0.2); */
    border: 1px solid #ddd;
  }
  
  .cart-item {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 1.5rem;
    padding: 1.5rem;
    border-bottom: 2px solid #e5e5e5;
    transition: opacity 0.3s, transform 0.3s;
  }
  
  .cart-item:last-child {
    border-bottom: none;
  }
  
  .removing {
    opacity: 0.5;
    transform: translateX(-10px);
  }
  
  .item-image-container {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    overflow: hidden;
    border-radius: 8px;
  }
  
  .item-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .item-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .item-info h2 {
    margin: 0;
    font-size: 1.25rem;
    color: #1a1a1a;
  }
  
  .item-price {
    color: #666;
    font-size: 1.1rem;
    margin: 0.5rem 0;
  }
  
  .item-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .quantity-controls {
    display: flex;
    align-items: center;
    background: #f8f9fa;
    border-radius: 6px;
    overflow: hidden;
  }
  
  .quantity-btn {
    background: none;
    border: none;
    padding: 0.5rem 1rem;
    font-size: 1.25rem;
    cursor: pointer;
    color: #1a1a1a;
    transition: background-color 0.2s;
  }
  
  .quantity-btn:hover:not(:disabled) {
    background: #e9ecef;
  }
  
  .quantity-btn:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
  
  .quantity-display {
    padding: 0 1rem;
    min-width: 40px;
    text-align: center;
    font-weight: 500;
  }
  
  .remove-btn {
    background: none;
    border: none;
    color: #dc3545;
    cursor: pointer;
    padding: 0.5rem;
    font-size: 0.875rem;
    transition: color 0.2s;
  }
  
  .remove-btn:hover:not(:disabled) {
    color: #c82333;
  }
  
  .remove-btn:disabled {
    color: #ffa5a5;
    cursor: not-allowed;
  }
  
  .item-subtotal {
    color: #1a1a1a;
    font-weight: 500;
    margin: 0;
  }
  
  /* .cart-summary {
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 2rem; */

  /* ... (previous styles remain the same until cart-summary) ... */

/* .cart-summary {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 2rem;
  height: fit-content;
} */
.cart-summary {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Bottom and sides shadow */
    /* 0 -2px 4px rgba(255, 255, 255, 0.2); */
  border: 1px solid #ddd;
  position: sticky;
  top: 2rem;
  height: fit-content;
}


.summary-header {
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
}

.summary-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #1a1a1a;
}

.summary-content {
  padding: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  color: #666;
}

.summary-row span:last-child {
  color: #1a1a1a;
  font-weight: 500;
}

.free-shipping {
  color: #2ecc71 !important;
  font-weight: 500;
}

.shipping-message {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
  margin: 1rem 0;
  font-size: 0.875rem;
  color: #666;
  text-align: center;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  padding-top: 1.5rem;
  border-top: 2px solid #eee;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
}

.checkout-btn {
  width: 100%;
  background: #2ecc71;
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-bottom: 1rem;
}

.checkout-btn:hover:not(:disabled) {
  background: #27ae60;
}

.checkout-btn:disabled {
  background: #a8e6bc;
  cursor: not-allowed;
}

.continue-shopping-link {
  display: block;
  text-align: center;
  color: #3498db;
  text-decoration: none;
  font-size: 0.875rem;
  transition: color 0.2s;
}

.continue-shopping-link:hover {
  color: #2980b9;
}

/* List Transitions */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-active {
  position: absolute;
}

.cart-product-name {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #1a1a1a;
  text-decoration: none;
  font-size: 1.25rem;
  font-weight: 370;
  margin: 0 0 0.5rem 0;
  transition: color 0.2s ease;
}

.cart-product-name:hover {
  color: #3498db;
  text-decoration: underline;
}


.item-image-container {
  position: relative;
  width: 100%;
  height: 16rem; /* Equivalent to h-64 in Tailwind */
  overflow: hidden;
  border-radius: 0.75rem; /* Equivalent to rounded-t-xl in Tailwind */
  padding: 0.75rem; /* Equivalent to p-3 in Tailwind */
  background-color: white; /* Ensure background is white */
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Match object-contain in Tailwind */
  transition: transform 0.3s ease; /* Match transition-transform duration-300 */
}

.item-image-container:hover .item-image {
  transform: scale(1.05); /* Match group-hover:scale-105 */
}

/* Add a subtle overlay for consistency */
.item-image-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.01); /* Match bg-black bg-opacity-10 */
}


/* Responsive Design */
@media (max-width: 1024px) {
  .cart-page {
    padding: 1rem;
  }

  .cart-content {
    grid-template-columns: 1fr;
  }

  .cart-summary {
    position: static;
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 1fr;
  }

  .item-image-container {
    padding-bottom: 60%;
    max-width: 300px;
    margin: 0 auto;
  }

  .item-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .quantity-controls {
    justify-content: center;
  }

  .remove-btn {
    text-align: center;
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .cart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-row,
  .summary-total {
    font-size: 0.875rem;
  }

  .checkout-btn {
    padding: 0.875rem;
    font-size: 0.875rem;
  }
}

/* Loading Shimmer Effect */
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.loading-skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 1000px 100%;
  animation: shimmer 2s infinite linear;
  border-radius: 4px;
}

/* Focus States for Accessibility */
.quantity-btn:focus,
.remove-btn:focus,
.checkout-btn:focus,
.continue-shopping:focus,
.continue-shopping-link:focus {
  outline: 2px solid #3498db;
  outline-offset: 2px;
}

/* Custom Scrollbar */
.cart-items {
  scrollbar-width: thin;
  scrollbar-color: #ccc #f8f9fa;
}

.cart-items::-webkit-scrollbar {
  width: 8px;
}

.cart-items::-webkit-scrollbar-track {
  background: #f8f9fa;
}

.cart-items::-webkit-scrollbar-thumb {
  background-color: #ccc;
  border-radius: 4px;
  border: 2px solid #f8f9fa;
}
</style>