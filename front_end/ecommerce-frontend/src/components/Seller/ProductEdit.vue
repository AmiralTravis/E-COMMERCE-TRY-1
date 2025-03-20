<!-- /components/Seller/ProductEdit.vue -->

<template>
    <div class="product-edit-container">
      <h1 class="text-2xl font-bold my-6 pt-2">Edit Product</h1>
  
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
        <button @click="cancelEdit" class="btn-secondary">Cancel</button>
        <button @click="saveProduct" class="btn-primary">Save Changes</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
  import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
  import { toast } from 'vue3-toastify';
  import api from '@/services/api';
  import ProductImageManagement from './ProductImageManagamenet.vue';
  
  const route = useRoute();
  const router = useRouter();
  
  // Reactive state

const product = ref({
  // Backend fields
  name: '',
  description: '',
  price: 0,
  discountPercentage: 0,
  costPrice: 0,
  stock: 0,
  images: [],
  
  // Dummy fields (localStorage only)
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
  const discountDates = ref({ start: '', end: '' });
  const isSaving = ref(false);
  const hasUnsavedChanges = ref(false);
  const initialData = ref(null);
  
  const productId = route.params.id;
  const DRAFT_KEY = `productDraft-${productId}`;
  
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
    if (discountDates.value.start && discountDates.value.end) {
      const start = new Date(discountDates.value.start);
      const end = new Date(discountDates.value.end);
      if (start > end) {
        toast.error('End date must be after start date');
        discountDates.value.end = '';
      }
    }
  };
  

const saveProduct = async () => {
  try {
    // Prepare payload without dummy fields
    const payload = {
      name: product.value.name,
      description: product.value.description,
      price: product.value.price,
      discountPercentage: product.value.discountPercentage,
      costPrice: product.value.costPrice,
      stock: product.value.stock,
    //   images: product.value.images.filter(img => img?.id).map((img, index) => ({
    //     id: img.id,
    //     order: index
      images: product.value.images,
      categoryIds: [
        ...selectedCategories.value.map(c => c.id),
        ...selectedSubcategories.value.map(c => c.id)
      ]
    };

    console.log("payload dataa: ", payload.images, payload.categoryIds);

    await api.put(`/seller/products/${route.params.id}`, payload);
    
    // Preserve dummy fields after save
    const response = await api.get(`/seller/products/${route.params.id}`);
    product.value = {
      ...response.data,
      dummyData: product.value.dummyData // Keep dummy fields
    };

    toast.success('Product updated successfully');

    // After successful save
    initialData.value = JSON.parse(JSON.stringify({
      ...product.value,
      dummyData: product.value.dummyData
    }));
    hasUnsavedChanges.value = false;
  } catch (error) {
    console.error('Save error:', error);
    toast.error(error.response?.data?.error || 'Failed to update product');
  }
};

  const cancelEdit = () => {
    localStorage.removeItem(DRAFT_KEY);
    router.push('/seller/manage-products');
  };
  
  // Category handling
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

  const loadDraft = () => {
  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    product.value.dummyData = { ...product.value.dummyData, ...JSON.parse(draft) };

}
};

watch(
  () => ({
    ...product.value,
    dummyData: product.value.dummyData
  }),
  (newVal) => {
    hasUnsavedChanges.value = JSON.stringify(newVal) !== JSON.stringify(initialData.value);
  },
  { deep: true }
);

watch(
  () => product.value.dummyData,
  (newDummyData) => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(newDummyData));
  },
  { deep: true }
);


  
  // Lifecycle hooks
  onMounted(async () => {
    window.scrollTo({top: 0});

    try {
      const [catResponse, productResponse] = await Promise.all([
        api.get('/products/categories'),
        api.get(`/seller/products/${route.params.id}`)
      ]);
  
      categories.value = catResponse.data;
      const productData = productResponse.data;
  
      product.value = {
        ...product.value,
        ...productData,
        images: productData.images || productData.productImages || [], // Ensure images is an array
        price: Number(productData.price) || 0,
        discountPercentage: Number(productData.discountPercentage) || 0,
        costPrice: Number(productData.costPrice) || 0,
        
      };
  
    
      selectedCategories.value = productData.categories
        .filter((cat) => cat.isMainCategory)
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          isMain: cat.isMainCategory
        }));
  
      selectedSubcategories.value = productData.categories
        .filter((cat) => !cat.isMainCategory)
        .map((cat) => ({
          id: cat.id,
          name: cat.name,
          isMain: cat.isMainCategory
        }));
  
      sellingPrice.value = product.value.price * (1 - (product.value.discountPercentage / 100));
  
      watch(
        () => product.value,
        (newVal) => {
          hasUnsavedChanges.value = JSON.stringify(newVal) !== JSON.stringify(initialData.value);
        },
        { deep: true }
      );

      loadDraft();
      initialData.value = JSON.parse(JSON.stringify(product.value));

    } catch (error) {
      console.error('Error loading product:', error);
      toast.error('Failed to load product');
    }
  });
  

onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('You have unsaved changes!');
    if (answer) {
      localStorage.removeItem(DRAFT_KEY);
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges.value) {
      e.preventDefault();
      e.returnValue = '';
    }
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', () => {});
  });
  </script>
  
  <style scoped>
  .product-edit-container {
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