<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center mb-8 text-gray-800">
        Orders History
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
        <div v-if="!hasOrderHistory" class="text-center py-16 bg-white rounded-lg shadow-sm">
          <div class="inline-block p-4 rounded-full bg-gray-100 mb-4">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <p class="text-xl text-gray-500 mb-4">No order history found</p>
          <router-link 
            to="/" 
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Start Shopping
          </router-link>
        </div>

        <!-- Orders List -->
        <div v-if="hasOrderHistory" class="space-y-6">
          <div v-for="order in paginatedOrders" :key="order.id">
            <OrderCard 
              :order="order"
              :is-completed="true"
              @view-details="viewOrderDetails"
            />
          </div>
          
          <!-- Load More Button -->
          <div v-if="hasMoreOrders" class="text-center mt-8">
            <button 
              @click="loadMoreOrders"
              class="px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500 border border-indigo-600 rounded-md hover:border-indigo-500"
              :disabled="loadingMore"
            >
              {{ loadingMore ? 'Loading...' : 'Load More Orders' }}
            </button>
          </div>
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
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useOrderUserStore } from '@/stores/OrderUserStore'
import OrderCard from './OrderCard.vue'

const orderStore = useOrderUserStore()
const selectedOrder = ref(null)
const loadingMore = ref(false)
const page = ref(1)
const itemsPerPage = ref(10)

const { loading } = storeToRefs(orderStore)

const orders = ref([])
const hasMoreOrders = ref(true)

const hasOrderHistory = computed(() => orders.value.length > 0)
const paginatedOrders = computed(() => orders.value)

const loadMoreOrders = async () => {
  if (loadingMore.value) return
  
  loadingMore.value = true
  page.value++
  
  try {
    const response = await orderStore.fetchCompletedOrders(page.value)
    if (response?.orders?.length) {
      orders.value = [...orders.value, ...response.orders]
      hasMoreOrders.value = response.orders.length >= itemsPerPage.value
    } else {
      hasMoreOrders.value = false
    }
  } finally {
    loadingMore.value = false
  }
}

const viewOrderDetails = (order) => {
  selectedOrder.value = order
}

onMounted(async () => {
  try {
    const response = await orderStore.fetchCompletedOrders(1)
    if (response?.orders) {
      orders.value = response.orders
      hasMoreOrders.value = response.orders.length >= itemsPerPage.value
    }
  } catch (error) {
    console.error('Failed to fetch initial orders:', error)
  }
})
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