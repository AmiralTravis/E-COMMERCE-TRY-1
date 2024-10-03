  <template>
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
  </style>