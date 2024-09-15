<template>
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
      <h2>Total: ${{ totalPrice }}</h2>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    computed: {
      ...mapGetters(['cartItems', 'cartTotalPrice']),
    },
    methods: {
      ...mapActions(['removeFromCart', 'updateCartQuantity']),
      updateQuantity(productId, quantity) {
        this.updateCartQuantity({ productId, quantity });
      },
    },
  };
  </script>
  