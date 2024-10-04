  <!-- <template>
    <div>
      <h1>Your Cart</h1>
      <div v-if="cartItemsComputed.length === 0">Your cart is empty</div>
      <ul v-else>
        <li v-for="item in cartItemsComputed" :key="item.id">
          {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
          <button @click="removeFromCart(item.id)">Remove</button>
          <input
            type="number"
            :value="item.quantity"
            @input="updateQuantity(item.id, $event.target.value)"
            min="1"
          />
        </li>
      </ul>
      <h2 v-if="cartItemsComputed.length > 0">Total: ${{ cartTotalPriceComputed.toFixed(2) }}</h2>
      <button 
        v-if="cartItemsComputed.length > 0" 
        @click="proceedToCheckout" 
        class="proceed-to-checkout"
      >
        Proceed to Checkout
      </button>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { useRouter } from 'vue-router'
  
  export default {
    name: 'ShoppingCart',
    setup() {
      const store = useStore()
      const router = useRouter()
  
      const cartItemsComputed = computed(() => store.getters['cart/cartItems'])
      const cartTotalPriceComputed = computed(() => {
        return cartItemsComputed.value.reduce((total, item) => total + item.price * item.quantity, 0)
      })
  
      const removeFromCart = (productId) => {
        store.dispatch('cart/removeFromCart', productId)
      }
  
      const updateQuantity = (productId, quantity) => {
        const qty = parseInt(quantity)
        if (qty > 0) {
          store.dispatch('cart/updateCartQuantity', { productId, quantity: qty })
        }
      }
  
      const proceedToCheckout = () => {
        router.push('/checkout')
      }
  
      return {
        cartItemsComputed,
        cartTotalPriceComputed,
        removeFromCart,
        updateQuantity,
        proceedToCheckout
      }
    }
  }
  </script>
  
  <style scoped>
  .proceed-to-checkout {
    margin-top: 20px;
    padding: 10px 20px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    font-size: 16px;
  }
  
  .proceed-to-checkout:hover {
    background-color: #45a049;
  }
  </style> -->




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
  import { defineComponent, computed } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter } from 'vue-router';
  
  export default defineComponent({
    name: 'CartFrontend',
    setup() {
      const store = useStore();
      const router = useRouter();
  
      const cartItems = computed(() => store.getters['cart/cartItems']);
      const subtotal = computed(() => 
        cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0)
      );
      const shipping = computed(() => subtotal.value > 100 ? 0 : 10);
      const total = computed(() => subtotal.value + shipping.value);
  
      const increaseQuantity = (item) => {
        store.dispatch('cart/updateCartQuantity', {
          productId: item.id,
          quantity: item.quantity + 1
        });
      };
  
      const decreaseQuantity = (item) => {
        if (item.quantity > 1) {
          store.dispatch('cart/updateCartQuantity', {
            productId: item.id,
            quantity: item.quantity - 1
          });
        }
      };
  
      const removeFromCart = (productId) => {
        store.dispatch('cart/removeFromCart', productId);
      };
  
      const proceedToCheckout = () => {
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
        proceedToCheckout
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