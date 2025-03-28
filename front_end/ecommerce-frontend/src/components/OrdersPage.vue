<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">
        My Orders
      </h1>

      <!-- Loading State -->
      <div v-if="loading" class="space-y-8">
        <div v-for="i in 2" :key="i" class="bg-white rounded-lg p-6 animate-pulse">
          <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-2 bg-gray-200 rounded mb-2"></div>
          <div class="h-2 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>

      <section v-else>
        <!-- Empty State -->
        <div v-if="!hasCurrentOrders" class="text-center py-16 bg-white rounded-lg shadow-sm">
          <div class="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p class="text-xl text-gray-500 mb-4">No current orders found</p>
          <router-link 
            to="/" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Start Shopping
          </router-link>
        </div>

        <!-- Current Orders -->
        <div v-if="hasCurrentOrders" class="space-y-8">
          <h2 class="text-2xl font-semibold text-gray-800 border-b pb-2">Active Orders</h2>
          <div class="space-y-6">
            <OrderCard 
              v-for="order in currentOrders" 
              :key="order.id" 
              :order="order"
              @view-details="viewOrderDetails"
            />
          </div>
        </div>

        <!-- Last Completed Order -->
        <div v-if="lastCompletedOrder" class="mt-12">
          <div class="flex justify-between items-center border-b pb-2 mb-6">
            <h2 class="text-2xl font-semibold text-gray-800">
              Recently Completed
            </h2>
            <router-link 
              to="/order-history" 
              class="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              View All Completed Orders →
            </router-link>
          </div>
          <OrderCard 
            :order="lastCompletedOrder"
            :is-completed="true"
            @view-details="viewOrderDetails"
          />
        </div>
      </section>
    </div>

    <!-- Order Details Modal -->
    <div 
      v-if="selectedOrder"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
      @click.self="selectedOrder = null"
    >
      <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Add detailed order view here if needed -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderUserStore } from '@/stores/OrderUserStore'
import OrderCard from './OrderCard.vue'

const orderStore = useOrderUserStore()
const selectedOrder = ref(null)

const { 
  currentOrders, 
  loading, 
  hasCurrentOrders,
} = storeToRefs(orderStore)

const lastCompletedOrder = ref(null)

onMounted(async () => {
  await Promise.all([
    orderStore.fetchCurrentOrders(),
    fetchLastCompletedOrder()
  ])
})

const fetchLastCompletedOrder = async () => {
  const response = await orderStore.fetchCompletedOrders(1, 1)
  if (response?.orders?.length) {
    lastCompletedOrder.value = response.orders[0]
  }
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
}
</script>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}
</style>