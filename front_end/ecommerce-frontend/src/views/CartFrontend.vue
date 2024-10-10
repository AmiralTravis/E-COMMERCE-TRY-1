<!-- views/CartFrontend.vue -->

  <!-- <template>
    <div class="cart-page">
      <h1>Your Shopping Cart</h1>
      
      <div v-if="getCartItems.length === 0" class="empty-cart">
        <p>Your cart is empty</p>
        <router-link to="/products" class="continue-shopping">Continue Shopping</router-link>
      </div>
      
      <div v-else class="cart-content">
        <div class="cart-items">
          <div v-for="item in getCartItems" :key="item.id" class="cart-item">
            <img :src="`/api/placeholder/100/100`" :alt="item.name" class="item-image" />
            <div class="item-details">
              <h2>{{ item.name }}</h2>
              <p class="item-price">${{ item.price.toFixed(2) }}</p>
            </div>
            <div class="item-quantity">
              <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
              <span>{{ item.quantity }}</span>
              <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
            </div>
            <p class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</p>
            <button @click="removeFromCart(item.id)" class="remove-btn">Remove</button>
          </div>
        </div>
        
        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${{ subtotal.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span>${{ shipping.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ total.toFixed(2) }}</span>
          </div>
          <button @click="proceedToCheckout" class="checkout-btn">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  </template> -->
  
    <!-- // Update CartFrontend.vue -->
<!-- <script>
import { defineComponent, computed, onMounted } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CartFrontend',
  
  setup() {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const router = useRouter();

    onMounted(async () => {
      if (authStore.isAuthenticated) {
        await cartStore.fetchCart();
      }
    });

    const cartItems = computed(() => cartStore.items);
    const subtotal = computed(() => cartStore.totalPrice);
    const shipping = computed(() => subtotal.value > 100 ? 0 : 10);
    const total = computed(() => subtotal.value + shipping.value);

    const increaseQuantity = async (item) => {
      await cartStore.updateQuantity(item.id, item.quantity + 1);
    };

    const decreaseQuantity = async (item) => {
      if (item.quantity > 1) {
        await cartStore.updateQuantity(item.id, item.quantity - 1);
      }
    };

    const removeFromCart = async (productId) => {
      await cartStore.removeFromCart(productId);
    };

    const proceedToCheckout = () => {
      if (!authStore.isAuthenticated) {
        router.push('/login?redirect=/checkout');
        return;
      }
      router.push('/checkout');
    };

    return {
      cartItems,
      subtotal,
      shipping,
      total,
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .empty-cart {
    text-align: center;
    padding: 40px;
  }
  
  .continue-shopping {
    display: inline-block;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  
  .cart-content {
    display: flex;
    gap: 20px;
  }
  
  .cart-items {
    flex: 2;
  }
  
  .cart-item {
    display: flex;
    align-items: center;
    padding: 20px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  
  .item-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
  
  .item-details {
    flex: 1;
    margin-left: 20px;
  }
  
  .item-quantity {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .quantity-btn {
    padding: 5px 10px;
    background-color: #f1f1f1;
    border: none;
    cursor: pointer;
  }
  
  .remove-btn {
    padding: 5px 10px;
    background-color: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .cart-summary {
    flex: 1;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: fit-content;
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
  
  .checkout-btn {
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
    .cart-content {
      flex-direction: column;
    }
    
    .cart-item {
      flex-direction: column;
      text-align: center;
    }
    
    .item-details {
      margin-left: 0;
      margin-top: 10px;
    }
  }
  </style> -->

  <!-- views/CartFrontend.vue -->
<template>
  <div class="cart-page">
    <h1>Your Shopping Cart</h1>
    
    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Your cart is empty</p>
      <router-link to="/products" class="continue-shopping">Continue Shopping</router-link>
    </div>
    
    <div v-else class="cart-content">
      <div class="cart-items">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="`/api/placeholder/100/100`" :alt="item.name" class="item-image" />
          <div class="item-details">
            <h2>{{ item.name }}</h2>
            <p class="item-price">${{ item.price.toFixed(2) }}</p>
          </div>
          <div class="item-quantity">
            <button @click="decreaseQuantity(item)" class="quantity-btn">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="increaseQuantity(item)" class="quantity-btn">+</button>
          </div>
          <p class="item-total">${{ (item.price * item.quantity).toFixed(2) }}</p>
          <button @click="removeFromCart(item.id)" class="remove-btn">Remove</button>
        </div>
      </div>
      
      <div class="cart-summary">
        <h2>Order Summary</h2>
        <div class="summary-row">
          <span>Subtotal:</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="summary-row">
          <span>Shipping:</span>
          <span>${{ shipping.toFixed(2) }}</span>
        </div>
        <div class="summary-row total">
          <span>Total:</span>
          <span>${{ total.toFixed(2) }}</span>
        </div>
        <button @click="proceedToCheckout" class="checkout-btn">Proceed to Checkout</button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted, watch } from 'vue';
import { useCartStore } from '../stores/cart';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CartFrontend',
  
  setup() {
    const cartStore = useCartStore();
    const authStore = useAuthStore();
    const router = useRouter();

    onMounted(async () => {
      if (authStore.isAuthenticated) {
        await cartStore.fetchCart();
      } else {
        cartStore.loadFromLocalStorage();
      }
    });

    watch(() => authStore.isAuthenticated, async (newValue) => {
      if (newValue) {
        // User just logged in
        await cartStore.syncLocalCartWithServer();
      } else {
        // User just logged out
        cartStore.saveToLocalStorage();
      }
    });

    const cartItems = computed(() => cartStore.items);
    const subtotal = computed(() => cartStore.totalPrice);
    const shipping = computed(() => subtotal.value > 100 ? 0 : 10);
    const total = computed(() => subtotal.value + shipping.value);

    const increaseQuantity = async (item) => {
      if (authStore.isAuthenticated) {
        await cartStore.updateQuantity(item.id, item.quantity + 1);
      } else {
        cartStore.updateLocalQuantity(item.id, item.quantity + 1);
      }
    };

    const decreaseQuantity = async (item) => {
      if (item.quantity > 1) {
        if (authStore.isAuthenticated) {
          await cartStore.updateQuantity(item.id, item.quantity - 1);
        } else {
          cartStore.updateLocalQuantity(item.id, item.quantity - 1);
        }
      }
    };

    const removeFromCart = async (productId) => {
      if (authStore.isAuthenticated) {
        await cartStore.removeFromCart(productId);
      } else {
        cartStore.removeFromLocalCart(productId);
      }
    };

    const proceedToCheckout = () => {
      if (!authStore.isAuthenticated) {
        router.push('/login?redirect=/checkout');
        return;
      }
      router.push('/checkout');
    };

    return {
      cartItems,
      subtotal,
      shipping,
      total,
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
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .empty-cart {
    text-align: center;
    padding: 40px;
  }
  
  .continue-shopping {
    display: inline-block;
    padding: 10px 20px;
    background-color: #3498db;
    color: white;
    text-decoration: none;
    border-radius: 4px;
  }
  
  .cart-content {
    display: flex;
    gap: 20px;
  }
  
  .cart-items {
    flex: 2;
  }
  
  .cart-item {
    display: flex;
    align-items: center;
    padding: 20px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  
  .item-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
  
  .item-details {
    flex: 1;
    margin-left: 20px;
  }
  
  .item-quantity {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .quantity-btn {
    padding: 5px 10px;
    background-color: #f1f1f1;
    border: none;
    cursor: pointer;
  }
  
  .remove-btn {
    padding: 5px 10px;
    background-color: #e74c3c;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .cart-summary {
    flex: 1;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 4px;
    height: fit-content;
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
  
  .checkout-btn {
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
    .cart-content {
      flex-direction: column;
    }
    
    .cart-item {
      flex-direction: column;
      text-align: center;
    }
    
    .item-details {
      margin-left: 0;
      margin-top: 10px;
    }
  }
  </style>