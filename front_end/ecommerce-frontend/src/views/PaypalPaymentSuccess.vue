<script>
// PaypalPaymentSuccess.vue
import { useOrderStore } from '@/stores/orderStore';

export default {
  setup() {
    const orderStore = useOrderStore();
    return { orderStore };
  },
  mounted() {
    const orderID = this.$route.query.orderID;
    this.orderStore.verifyPaypalOrder(orderID, this.cartTotal);
  }
}

// In your Vue component or Pinia store
// async function handlePayPalSuccess(orderID) {
//   try {
//     const response = await axios.post('/api/paypal/verify-order', { 
//       orderID 
//     });
//   } catch (error) {
//     console.error('Order verification failed', error);
//   }
// }
</script>