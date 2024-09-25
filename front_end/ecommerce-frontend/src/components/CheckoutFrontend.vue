<!-- <template>
    <div class="checkout">
      <h1>Checkout</h1> -->
  
      <!-- Order Summary -->
      <!-- <section class="order-summary">
        <h2>Order Summary</h2>
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" />
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p>Price: ${{ item.price }}</p>
            <p>Quantity: {{ item.quantity }}</p>
          </div>
        </div>
        <p>Total: ${{ totalPrice }}</p>
      </section> -->
  
      <!-- Shipping Information -->
      <!-- <section class="shipping-info">
        <h2>Shipping Information</h2>
        <form @submit.prevent="handleCheckout">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" v-model="shippingInfo.name" required />
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <input type="text" id="address" v-model="shippingInfo.address" required />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" v-model="shippingInfo.city" required />
          </div>
          <div class="form-group">
            <label for="postalCode">Postal Code</label>
            <input type="text" id="postalCode" v-model="shippingInfo.postalCode" required />
          </div>
          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" v-model="shippingInfo.country" required />
          </div> -->
  
          <!-- Payment Information -->
          <!-- <h2>Payment Information</h2>
          <div class="form-group">
            <label for="paymentMethod">Payment Method</label>
            <select id="paymentMethod" v-model="paymentMethod" required>
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
   -->
          <!-- Submit Button -->
          <!-- <button type="submit" class="btn-checkout">Place Order</button>
        </form>
      </section>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        cartItems: [
          // Replace with real data or Vuex state management
          { id: 1, name: "Smartphone", price: 299, quantity: 1, image: "@/assets/smartphone.jpg" },
          { id: 2, name: "Laptop", price: 999, quantity: 1, image: "@/assets/laptop.jpg" },
        ],
        shippingInfo: {
          name: "",
          address: "",
          city: "",
          postalCode: "",
          country: "",
        },
        paymentMethod: "creditCard",
      };
    },
    computed: {
      totalPrice() {
        return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    },
    methods: {
      handleCheckout() {
        // Process checkout logic (e.g., validation, API calls, etc.)
        alert("Order placed successfully!");
      },
    },
  };
  </script>
  
  <style scoped>
  /* Add styles for the checkout page */
  .order-summary,
  .shipping-info {
    margin-bottom: 20px;
  }
  
  .cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .item-details {
    margin-left: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .btn-checkout {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>
   -->


   <template>
    <div class="checkout">
      <h1>Checkout</h1>
  
      <!-- Order Summary -->
      <section class="order-summary">
        <h2>Order Summary</h2>
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <img :src="item.image" :alt="item.name" />
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p>Price: ${{ item.price }}</p>
            <p>Quantity: {{ item.quantity }}</p>
          </div>
        </div>
        <p>Total: ${{ totalPrice.toFixed(2) }}</p>
      </section>
  
      <!-- Shipping Information -->
      <section class="shipping-info">
        <h2>Shipping Information</h2>
        <form @submit.prevent="handleCheckout">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" v-model="shippingInfo.name" required />
          </div>
          <div class="form-group">
            <label for="address">Address</label>
            <input type="text" id="address" v-model="shippingInfo.address" required />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input type="text" id="city" v-model="shippingInfo.city" required />
          </div>
          <div class="form-group">
            <label for="postalCode">Postal Code</label>
            <input type="text" id="postalCode" v-model="shippingInfo.postalCode" required />
          </div>
          <div class="form-group">
            <label for="country">Country</label>
            <input type="text" id="country" v-model="shippingInfo.country" required />
          </div>
  
          <!-- Payment Information -->
          <h2>Payment Information</h2>
          <div class="form-group">
            <label for="paymentMethod">Payment Method</label>
            <select id="paymentMethod" v-model="paymentMethod" required>
              <option value="creditCard">Credit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
  
          <!-- Submit Button -->
          <button type="submit" class="btn-checkout">Place Order</button>
        </form>
      </section>
    </div>
  </template>
  
  <script>
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  
  export default {
    setup() {
      const store = useStore()
  
      const cartItems = computed(() => store.getters['cart/cartItems'])
      const totalPrice = computed(() => store.getters['cart/cartTotalPrice'])
  
      const shippingInfo = {
        name: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
      }
  
      const paymentMethod = "creditCard"
  
      const handleCheckout = () => {
        // Process checkout logic (e.g., validation, API calls, etc.)
        console.log('Order placed:', { shippingInfo, paymentMethod, cartItems: cartItems.value })
        alert("Order placed successfully!")
        // Here you would typically call an action to process the order
        // store.dispatch('orders/placeOrder', { shippingInfo, paymentMethod, cartItems: cartItems.value })
      }
  
      return {
        cartItems,
        totalPrice,
        shippingInfo,
        paymentMethod,
        handleCheckout
      }
    }
  }
  </script>
  
  <style scoped>
  /* Add styles for the checkout page */
  .order-summary,
  .shipping-info {
    margin-bottom: 20px;
  }
  
  .cart-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .item-details {
    margin-left: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .btn-checkout {
    padding: 10px 20px;
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  </style>