<!-- /components/SidePanel.vue -->
<template>
  <div class="side-panel">
    <h2 class="panel-title">Filter Categories</h2>
    
    <button @click="clearAllFilters" class="clear-filters-btn">
      Clear All Filters
    </button>

    <div class="filter-section rating-box">
      <h3>Min-Rating</h3>
      <div class="star-rating-filter">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ active: star <= filterStore.filters.rating[0] }"
          @click="toggleRating(star)"
        >
          ★
        </span>
      </div>
    </div>

    <div class="filter-section">
      <!-- <h3>Price Range</h3> -->
      <PriceRangeSlider
        ref="priceRangeSlider"
        :min="0"
        :max="5000"
        :priceGap="100"
        :initialMinPrice="filterStore.filters.minPrice"
        :initialMaxPrice="filterStore.filters.maxPrice"
        @apply-price-range="applyPriceRange"
      />
    </div>

    <div class="filter-section">
      <!-- <h3>Discount Range</h3> -->
      <DiscountRangeSlider
        ref="discountRangeSlider"
        :min="0"
        :max="100"
        :discountGap="5"
        :initialDiscountRanges="filterStore.filters.discountRanges"
        @apply-discount-range="applyDiscountRange"
      />
    </div>

    <div class="filter-section categories-box">
      <div class="category-header">
        <h3>Categories</h3>
        <button @click="clearCategoryFilters" class="clear-category-btn">
          Clear
        </button>
      </div>
      <div class="category-filter">
        <div v-for="category in categories" :key="category.name" class="category-item">
          <label class="category-label">
            <input
              type="checkbox"
              class="checkbox"
              :checked="isCategorySelected(category)"
              @change="toggleCategory(category)"
            />
            <span class="checkbox-custom"></span>
            <span class="category-name">{{ category.name }}</span>
          </label>
          <div v-if="category.children" class="sub-categories">
            <div v-for="subCategory in category.children" :key="subCategory" class="sub-category-item">
              <label class="category-label">
                <input
                  type="checkbox"
                  class="checkbox"
                  :checked="filterStore.filters.categories.includes(subCategory)"
                  @change="toggleSubCategory(subCategory, category)"
                />
                <span class="checkbox-custom"></span>
                <span class="category-name">{{ subCategory }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PriceRangeSlider from '../ProductList_components/PriceRangeSlider.vue';
import DiscountRangeSlider from '../ProductList_components/DiscountRangeSlider.vue';
import { useFilterStore } from '@/stores/useFilterStore';
import { ref } from 'vue';

export default {
  name: 'SidePanel',
  components: {
    PriceRangeSlider,
    DiscountRangeSlider,
  },
  props: {
    categories: {
      type: Array,
      required: true,
    },
  },
  emits: ['apply-filters', 'clear-filters'],
  setup(props, { emit }) {
    const filterStore = useFilterStore();
    const discountRanges = ref([{ min: 0, max: 100 }]);

    const toggleRating = (star) => {
      if (filterStore.filters.rating[0] === star) {
        filterStore.filters.rating = [];
      } else {
        filterStore.filters.rating = [star];
      }
      emit('apply-filters', filterStore.filters);
    };

    const isCategorySelected = (category) => {
      if (filterStore.filters.categories.includes(category.name)) {
        return true;
      }
      if (category.children) {
        return category.children.every((subCategory) =>
          filterStore.filters.categories.includes(subCategory)
        );
      }
      return false;
    };

    const toggleCategory = (category) => {
      const newCategories = [...filterStore.filters.categories];

      if (isCategorySelected(category)) {
        filterStore.filters.categories = newCategories.filter(
          (c) => c !== category.name && !category.children?.includes(c)
        );
      } else {
        filterStore.filters.categories = [
          ...newCategories,
          category.name,
          ...(category.children || []),
        ];
      }
      emit('apply-filters', filterStore.filters);
    };

    const toggleSubCategory = (subCategory, parentCategory) => {
      const newCategories = [...filterStore.filters.categories];
      
      if (filterStore.filters.categories.includes(subCategory)) {
        // Remove subcategory
        filterStore.filters.categories = newCategories.filter(c => c !== subCategory);
        
        // If parent category is selected, remove it as well since not all subcategories are selected
        if (filterStore.filters.categories.includes(parentCategory.name)) {
          filterStore.filters.categories = filterStore.filters.categories.filter(
            c => c !== parentCategory.name
          );
        }
      } else {
        // Add subcategory
        filterStore.filters.categories = [...newCategories, subCategory];
        
        // If all subcategories are now selected, add parent category
        if (parentCategory.children.every(sub => 
          filterStore.filters.categories.includes(sub)
        )) {
          filterStore.filters.categories = [
            ...filterStore.filters.categories,
            parentCategory.name
          ];
        }
      }
      emit('apply-filters', filterStore.filters);
    };

    const applyPriceRange = (range) => {
      filterStore.filters.minPrice = range.min;
      filterStore.filters.maxPrice = range.max;
      emit('apply-filters', filterStore.filters);
    };

    const clearAllFilters = () => {
      filterStore.resetFilters();
      emit('clear-filters');
    };

    const clearCategoryFilters = () => {
      filterStore.filters.categories = [];
      emit('apply-filters', filterStore.filters);
    };

    const applyDiscountRange = (ranges) => {
      filterStore.setDiscountRanges(ranges);
      emit('apply-filters', filterStore.filters);
    };

    return {
      filterStore,
      discountRanges,
      toggleRating,
      isCategorySelected,
      toggleCategory,
      toggleSubCategory,
      applyPriceRange,
      clearAllFilters,
      clearCategoryFilters,
      applyDiscountRange
    };
  },
};
</script>

<style scoped>
.side-panel {
  /* min-width: 300px; */
  /* max-width: 300px; */
  padding: 16px;
  background-color: rgb(250, 233, 218);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 20px);
  overflow-y: auto;
  position: sticky;
  top: 10px;
}

.side-panel::-webkit-scrollbar {
  width: 4px;
}

.side-panel::-webkit-scrollbar-thumb {
  background: #DBB85C;
  border-radius: 10px;
  opacity: 0.7;
}

.side-panel::-webkit-scrollbar-thumb:hover {
  opacity: 1;
}

.panel-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
}

.clear-filters-btn {
  background-color: #FE8F88;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 14px;
  transition: all 0.2s ease;
  margin-bottom: 16px;
}

.clear-filters-btn:hover {
  background-color: #FE7770;
  transform: translateY(-1px);
}

.filter-section {
  margin-bottom: 20px;
}

.filter-section h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 12px;
}

/* Boxed sections */
.rating-box, .categories-box {
  background-color: rgb(254, 244, 234);
  border-radius: 8px;
  padding: 12px;
  padding-bottom: 42px;
}

/* Star Rating Styles */
.star-rating-filter {
  display: flex;
  gap: 5px;
}

.star {
  cursor: pointer;
  font-size: 24px;
  color: #E2E8F0;
  transition: color 0.2s ease;
}

.star.active {
  color: #DBB85C;
}

/* Category Styles */
.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.clear-category-btn {
  background-color: transparent;
  color: #FE8F88;
  border: 1px solid #FE8F88;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s ease;
}

.clear-category-btn:hover {
  background-color: #FE8F88;
  color: white;
}

.category-filter {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-item {
  margin-bottom: 8px;
}

.category-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
}

.category-name {
  font-size: 14px;
  color: #555;
}

/* Checkbox Styles */
.checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-custom {
  position: relative;
  display: inline-block;
  width: 16px;
  height: 16px;
  background-color: white;
  border: 2px solid #DBB85C;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.checkbox:checked ~ .checkbox-custom {
  background-color: #DBB85C;
}

.checkbox:checked ~ .checkbox-custom::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.sub-categories {
  margin-left: 24px;
  margin-top: 6px;
}

@media (max-width: 768px) {
  .side-panel {
    width: 100%;
    max-width: none;
    height: auto;
    position: static;
    margin-bottom: 20px;
  }
}
</style>