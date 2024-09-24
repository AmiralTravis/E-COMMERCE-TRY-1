   <!-- <template>
    <div>
      <h1>Your Cart</h1>
      <div v-if="cartItems.length === 0">Your cart is empty</div>
      <ul v-else>
        <li v-for="item in cartItems" :key="item.id">
          {{ item.name }} - ${{ item.price }} x {{ item.quantity }}
          <button @click="removeFromCart(item.id)">Remove</button>
          <input
            type="number"
            v-model.number="item.quantity"
            @input="updateQuantity(item.id, item.quantity)"
            min="1"
          />
        </li>
      </ul>
      <h2 v-if="cartItems.length > 0">Total: ${{ cartTotalPrice.toFixed(2) }}</h2>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'ShoppingCart',
    computed: {
      ...mapGetters('cart', ['cartItems', 'cartTotalPrice'])
    },
    methods: {
      ...mapActions('cart', ['removeFromCart', 'updateCartQuantity']),
      updateQuantity(productId, quantity) {
        const qty = parseInt(quantity);
        if (qty > 0) {
          this.updateCartQuantity({ productId, quantity: qty });
        }
      },
    }
  };
  </script> -->
  















  <!-- <template>
    <div>
      <h1>Your Cart</h1>
      <div v-if="cartItems.length === 0">Your cart is empty</div>
      <ul v-else>
        <li v-for="item in cartItems" :key="item.id">
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
      <h2 v-if="cartItems.length > 0">Total: ${{ cartTotalPrice.toFixed(2) }}</h2>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'ShoppingCart',
    computed: {
      ...mapGetters('cart', ['cartItems', 'cartTotalPrice'])
    },
    methods: {
      ...mapActions('cart', ['removeFromCart', 'updateCartQuantity']),
      updateQuantity(productId, quantity) {
        const qty = parseInt(quantity);
        if (qty > 0) {
          this.updateCartQuantity({ productId, quantity: qty });
        }
      },
    }
  };
  </script> -->
<!-- 

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
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  
  export default {
    name: 'ShoppingCart',
    setup() {
      const store = useStore()
  
      const cartItemsComputed = computed(() => store.getters['cart/cartItems'])
      const cartTotalPriceComputed = computed(() => store.getters['cart/cartTotalPrice'])
  
      const removeFromCart = (productId) => {
        store.dispatch('cart/removeFromCart', productId)
      }
  
      const updateQuantity = (productId, quantity) => {
        const qty = parseInt(quantity)
        if (qty > 0) {
          store.dispatch('cart/updateCartQuantity', { productId, quantity: qty })
        }
      }
  
      return {
        cartItemsComputed,
        cartTotalPriceComputed,
        removeFromCart,
        updateQuantity
      }
    }
  }
  </script> -->


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
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  
  export default {
    name: 'ShoppingCart',
    setup() {
      const store = useStore()
  
      const cartItemsComputed = computed(() => store.getters['cart/cartItems'])
      const cartTotalPriceComputed = computed(() => store.getters['cart/cartTotalPrice'])
  
      const removeFromCart = (productId) => {
        store.dispatch('cart/removeFromCart', productId)
      }
  
      const updateQuantity = (productId, quantity) => {
        const qty = parseInt(quantity)
        if (qty > 0) {
          store.dispatch('cart/updateCartQuantity', { productId, quantity: qty })
        }
      }
  
      return {
        cartItemsComputed,
        cartTotalPriceComputed,
        removeFromCart,
        updateQuantity
      }
    }
  }
  </script>