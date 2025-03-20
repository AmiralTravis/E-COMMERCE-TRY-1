<!-- /components/Admin/ProductAdd.vue -->

<template>
    <div class="product-add-container">
      <h1 class="text-2xl font-bold my-6 pt-2">Add New Product</h1>
  
      <!-- Image Management -->
      <div class="productImage mb-6">
        <ProductImageManagement 
            v-model="product.images" 
            v-if="Array.isArray(product.images)"
        />
      </div>
  
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column: Product Details -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Pricing Section -->
          <section class="panel">
            <h2 class="section-title">Pricing & Discount</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="form-group">
                <label>Selling Price</label>
                <input
                  :value="sellingPrice.toFixed(2)"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-input"
                  @input="updateSellingPrice($event.target.value)"
                  placeholder="0.00"
                />
              </div>
  
              <div class="form-group">
                <label>Original Price</label>
                <input
                  v-model.number="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-input"
                  placeholder="0.00"
                />
              </div>
  
              <div class="form-group">
                <label>Cost Price</label>
                <input
                  v-model.number="product.costPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  class="form-input"
                  placeholder="0.00"
                />
              </div>
  
              <div class="form-group">
                <label>Discount Percentage</label>
                <input
                  v-model.number="currentDiscount"
                  type="number"
                  step="1"
                  min="0"
                  max="75"
                  class="form-input"
                  placeholder="0"
                />
              </div>
  
              <div class="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  v-model="product.dummyData.discountDates.start"
                  class="form-input"
                  @change="validateDates"
                />
              </div>
  
              <div class="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  v-model="product.dummyData.discountDates.end"
                  class="form-input"
                  @change="validateDates"
                />
              </div>
            </div>
          </section>
  
          <!-- Product Details -->
          <section class="panel">
            <h2 class="section-title">Product Details</h2>
            <div class="space-y-4">
              <div class="form-group">
                <label>Product Name</label>
                <input
                  v-model="product.name"
                  class="form-input"
                  placeholder="Enter product name"
                />
              </div>
  
              <div class="form-group">
                <label>Description</label>
                <textarea
                  v-model="product.description"
                  rows="4"
                  class="form-input"
                  placeholder="Enter product description"
                ></textarea>
              </div>
  
              <div class="grid grid-cols-2 gap-4">
                <div class="form-group">
                  <label>SKU</label>
                  <input
                    v-model="product.dummyData.sku"
                    class="form-input"
                    placeholder="Enter SKU"
                  />
                </div>
  
                <div class="form-group">
                  <label>Stock Quantity</label>
                  <input
                    v-model.number="product.stock"
                    type="number"
                    class="form-input"
                    placeholder="Enter stock"
                  />
                </div>
              </div>
            </div>
          </section>
  
          <!-- Inventory Management -->
          <section class="panel">
            <h2 class="section-title">Inventory Management</h2>
            <div class="space-y-4">
              <div class="flex items-center gap-2">
                <input
                  v-model="product.dummyData.trackInventory"
                  type="checkbox"
                  id="trackInventory"
                  class="w-4 h-4"
                />
                <label for="trackInventory">Track inventory for this product</label>
              </div>
  
              <div class="flex items-center gap-2">
                <input
                  v-model="product.dummyData.continueWhenOutOfStock"
                  type="checkbox"
                  id="continueSelling"
                  class="w-4 h-4"
                />
                <label for="continueSelling">Continue selling when out of stock</label>
              </div>
            </div>
          </section>
  
          <!-- Shipping Details -->
          <section class="panel">
            <h2 class="section-title">Shipping Details</h2>
            <div class="space-y-4">
              <div class="form-group">
                <label>Weight (kg)</label>
                <input
                  v-model.number="product.dummyData.weight"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1000"
                  class="form-input"
                  placeholder="0.0"
                  @change="validateWeight"
                />
              </div>
  
              <div class="grid grid-cols-3 gap-4">
                <div class="form-group">
                  <label>Length</label>
                  <input
                    v-model.number="product.dummyData.dimensions.length"
                    type="number"
                    min="0"
                    max="500"
                    class="form-input"
                    placeholder="cm"
                    @change="validateDimension('length')"
                  />
                </div>
                <div class="form-group">
                  <label>Width</label>
                  <input
                    v-model.number="product.dummyData.dimensions.width"
                    type="number"
                    min="0"
                    max="500"
                    class="form-input"
                    placeholder="cm"
                    @change="validateDimension('width')"
                  />
                </div>
                <div class="form-group">
                  <label>Height</label>
                  <input
                    v-model.number="product.dummyData.dimensions.height"
                    type="number"
                    min="0"
                    max="500"
                    class="form-input"
                    placeholder="cm"
                    @change="validateDimension('height')"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
  
        <!-- Right Column: Categories -->
        <div class="space-y-6">
          <!-- Categories Section -->
          <section class="panel">
            <h2 class="section-title">Categories</h2>
            <div class="category-checkboxes space-y-2">
              <div
                v-for="category in categories"
                :key="category.id"
                class="category-group"
              >
                <!-- Parent Category -->
                <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <input
                    type="checkbox"
                    :id="`category-${category.id}`"
                    :checked="isCategorySelected(category)"
                    @change="toggleCategory(category, true)"
                    class="w-4 h-4"
                  />
                  <label :for="`category-${category.id}`" class="font-medium">
                    {{ category.name }}
                  </label>
                </div>
  
                <!-- Child Categories -->
                <div
                  v-if="category.children && category.children.length"
                  class="subcategories ml-6 mt-1 space-y-2"
                >
                  <div
                    v-for="child in category.children"
                    :key="child.id"
                    class="flex items-center gap-2"
                  >
                    <input
                      type="checkbox"
                      :id="`subcategory-${child.id}`"
                      :checked="isSubcategorySelected(child)"
                      @change="toggleCategory(child, false)"
                      class="w-4 h-4"
                    />
                    <label :for="`subcategory-${child.id}`">{{ child.name }}</label>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
  
      <!-- Form Actions -->
      <div class="sticky bottom-0 bg-white py-4 border-t mt-8 flex justify-end gap-4">
        <button @click="cancelAdd" class="btn-secondary">Cancel</button>
        <button @click="addProduct" class="btn-primary">Add Product</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { toast } from 'vue3-toastify';
  import api from '@/services/api';
  import ProductImageManagement from '@/components/ProductImageManagement.vue';
  
  const router = useRouter();
  
  // Reactive state
  const product = ref({
    name: '',
    description: '',
    price: 0,
    discountPercentage: 0,
    costPrice: 0,
    stock: 0,
    images: [],
    dummyData: {
      sku: '',
      trackInventory: true,
      continueWhenOutOfStock: false,
      weight: 0,
      dimensions: { length: 0, width: 0, height: 0 },
      discountDates: { start: '', end: '' }
    }
  });
  
  const categories = ref([]);
  const selectedCategories = ref([]);
  const selectedSubcategories = ref([]);
  const sellingPrice = ref(0);
  
  // Computed properties
  const originalPrice = computed({
    get: () => product.value.price,
    set: (value) => {
      const newPrice = Number(value) || 0;
      product.value.price = newPrice;
      if (newPrice > 0 && sellingPrice.value > 0) {
        const newDiscount = ((newPrice - sellingPrice.value) / newPrice) * 100;
        product.value.discountPercentage = Math.min(Math.max(newDiscount, 0), 75);
      }
    }
  });
  
  const currentDiscount = computed({
    get: () => Math.round(product.value.discountPercentage),
    set: (value) => {
      const roundedValue = Math.min(Math.max(Math.round(Number(value) || 0), 0), 75);
      product.value.discountPercentage = roundedValue;
      sellingPrice.value = originalPrice.value * (1 - (roundedValue / 100));
    }
  });
  
  // Methods
  const updateSellingPrice = (newSellingPrice) => {
    const sp = Number(newSellingPrice) || 0;
    sellingPrice.value = sp;
    if (originalPrice.value > 0) {
      const newDiscount = Math.min(Math.max(Math.round(((originalPrice.value - sp) / originalPrice.value) * 100), 0), 75);
      product.value.discountPercentage = newDiscount;
    }
  };
  
  const validateWeight = () => {
    if (product.value.dummyData.weight < 0) {
      toast.error('Weight cannot be negative');
      product.value.dummyData.weight = 0;
    }
  };
  
  const validateDimension = (type) => {
    const dimensions = product.value.dummyData.dimensions || {};
    const value = dimensions[type] || 0;
    
    if (value < 0) {
      toast.error('Dimensions cannot be negative');
      dimensions[type] = 0;
    }
  };
  
  const validateDates = () => {
    if (product.value.dummyData.discountDates.start && product.value.dummyData.discountDates.end) {
      const start = new Date(product.value.dummyData.discountDates.start);
      const end = new Date(product.value.dummyData.discountDates.end);
      if (start > end) {
        toast.error('End date must be after start date');
        product.value.dummyData.discountDates.end = '';
      }
    }
  };
  
  // const addProduct = async () => {
  //   try {
  //     const payload = {
  //       name: product.value.name,
  //       description: product.value.description,
  //       price: product.value.price,
  //       discountPercentage: product.value.discountPercentage,
  //       costPrice: product.value.costPrice,
  //       stock: product.value.stock,
  //       images: product.value.images.filter(img => img?.id).map((img, index) => ({
  //         id: img.id,
  //         order: index
  //       })),
  //       categoryIds: [
  //         ...selectedCategories.value.map(c => c.id),
  //         ...selectedSubcategories.value.map(c => c.id)
  //       ]
  //     };
  
  //     const response = await api.post('/admin/products', payload);
  //     toast.success('Product added successfully');
  //     router.push('/admin/manage-products');
  //   } catch (error) {
  //     console.error('Add product error:', error);
  //     toast.error(error.response?.data?.error || 'Failed to add product');
  //   }
  // };
  const addProduct = async () => {
    try {
      // Step 1: Create the product
      const payload = {
        name: product.value.name,
        description: product.value.description,
        price: product.value.price,
        discountPercentage: product.value.discountPercentage,
        costPrice: product.value.costPrice,
        stock: product.value.stock,
        categoryIds: [
          ...selectedCategories.value.map(c => c.id),
          ...selectedSubcategories.value.map(c => c.id)
        ]
      };
  
      const response = await api.post('/seller/products', payload);
      const newProductId = response.data.id;
  
      // Step 2: Upload images (if any)
      if (product.value.images.length > 0) {
        const formData = new FormData();
        product.value.images.forEach(image => {
          if (image.file) {
            formData.append('thumbnails', image.file);
          }
        });
  
        await api.post(
          `/admin/products/${newProductId}/thumbnails`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
      }
  
      toast.success('Product added successfully');
      router.push('/admin/manage-products');
    } catch (error) {
      console.error('Add product error:', error);
      toast.error(error.response?.data?.error || 'Failed to add product');
    }
  };
  
  const cancelAdd = () => {
    router.push('/admin/manage-products');
  };
  
  const isCategorySelected = (category) => {
    return selectedCategories.value.some((c) => c.id === category.id);
  };
  
  const isSubcategorySelected = (subcategory) => {
    return selectedSubcategories.value.some((c) => c.id === subcategory.id);
  };
  
  const toggleCategory = (category, isParent) => {
    if (isParent) {
      const exists = selectedCategories.value.some((c) => c.id === category.id);
      if (exists) {
        selectedCategories.value = selectedCategories.value.filter((c) => c.id !== category.id);
        selectedSubcategories.value = selectedSubcategories.value.filter(
          (sc) => !category.children.some((child) => child.id === sc.id)
        );
      } else {
        selectedCategories.value = [...selectedCategories.value, category];
        selectedSubcategories.value = [
          ...selectedSubcategories.value,
          ...category.children.filter(
            (child) => !selectedSubcategories.value.some((sc) => sc.id === child.id)
          )
        ];
      }
    } else {
      const exists = selectedSubcategories.value.some((c) => c.id === category.id);
      if (exists) {
        selectedSubcategories.value = selectedSubcategories.value.filter((c) => c.id !== category.id);
        const parent = categories.value.find((c) => c.children?.some((ch) => ch.id === category.id));
        if (parent && !parent.children.some((ch) => selectedSubcategories.value.some((sc) => sc.id === ch.id))) {
          selectedCategories.value = selectedCategories.value.filter((c) => c.id !== parent.id);
        }
      } else {
        selectedSubcategories.value = [...selectedSubcategories.value, category];
        const parent = categories.value.find((c) => c.children?.some((ch) => ch.id === category.id));
        if (parent && !selectedCategories.value.some((c) => c.id === parent.id)) {
          selectedCategories.value = [...selectedCategories.value, parent];
        }
      }
    }
  };
  
  onMounted(async () => {
    try {
      const catResponse = await api.get('/products/categories');
      categories.value = catResponse.data;
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  });
  </script>
  
  <style scoped>
  .product-add-container {
    max-width: 1300px;
    margin: 0 auto;
    padding-left: 3rem;
    padding-right: 3rem;
  }
  
  .productImage {
    min-height: 400px;
    overflow-y: auto;
  }
  
  .panel {
    @apply bg-white rounded-lg p-6 shadow-sm border border-gray-200;
  }
  
  .section-title {
    @apply text-lg font-semibold mb-4 pb-2 border-b border-gray-200;
  }
  
  .form-input {
    @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
  }
  
  .btn-primary {
    @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
  }
  
  .btn-secondary {
    @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors;
  }
  
  .category-checkboxes {
    @apply space-y-2 p-2;
  }
  
  .category-group {
    @apply space-y-1;
  }
  </style>