<!-- /components/SidePanel.vue -->
<template>
  <div class="side-panel">
    <h2>Filter Categories</h2>

    <!-- Clear All Filters Button -->
    <button @click="clearAllFilters" class="clear-filters-btn">
      Clear All Filters
    </button>

    <!-- Star Rating Filter -->
    <div class="filter-section">
      <h3>Rating</h3>
      <div class="star-rating-filter">
        <span
          v-for="star in 5"
          :key="star"
          class="star"
          :class="{ active: star <= selectedRating }"
          @click="toggleRating(star)"
        >
          ★
        </span>
      </div>
    </div>

    <!-- Price Range Slider -->
    <div class="filter-section">
      <h3>Price Range</h3>
      <PriceRangeSlider
        ref="priceRangeSlider"
        :min="0"
        :max="5000"
        :priceGap="100"
        :initialMinPrice="minPrice"
        :initialMaxPrice="maxPrice"
        @apply-price-range="applyPriceRange"
      />
    </div>

    <!-- Category Filter -->
    <div class="filter-section">
      <div class="category-header">
        <h3>Categories</h3>
        <button @click="clearCategoryFilters" class="clear-category-btn">
          Clear All
        </button>
      </div>
      <div class="category-filter">
        <div v-for="category in categories" :key="category.name" class="category-item">
          <label>
            <input
              class="checkbox"
              type="checkbox"
              v-model="selectedCategories"
              :value="category.name"
              @change="toggleCategory(category)"
            />
            {{ category.name }}
          </label>
          <div v-if="category.children" class="sub-categories">
            <div v-for="subCategory in category.children" :key="subCategory" class="sub-category-item">
              <label>
                <input
                  class="sub-checkbox"
                  type="checkbox"
                  v-model="selectedCategories"
                  :value="subCategory"
                  @change="toggleSubCategory(category)"
                />
                {{ subCategory }}
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PriceRangeSlider from './PriceRangeSlider.vue';

export default {
  name: 'SidePanel',
  components: {
    PriceRangeSlider,
  },
  props: {
    categories: {
      type: Array,
      required: true,
    },
    initialFilters: {
      type: Object,
      default: () => ({
        rating: 0,
        categories: [],
        minPrice: 0,
        maxPrice: 5000,
      }),
    },
  },
  emits: ['apply-filters', 'clear-filters'],
  data() {
    return {
      selectedRating: this.initialFilters.rating || 0,
      selectedCategories: this.initialFilters.categories || [],
      minPrice: this.initialFilters.minPrice || 0,
      maxPrice: this.initialFilters.maxPrice || 5000,
    };
  },
  watch: {
    // Watch for changes in filters and emit them to the parent
    selectedRating(newRating) {
      this.emitFilters();
    },
    selectedCategories(newCategories) {
      this.emitFilters();
    },
    minPrice(newMinPrice) {
      this.emitFilters();
    },
    maxPrice(newMaxPrice) {
      this.emitFilters();
    },
  },
  methods: {
    toggleRating(star) {
      this.selectedRating = this.selectedRating === star ? 0 : star;
    },
    toggleCategory(category) {
      if (this.selectedCategories.includes(category.name)) {
        // Add all subcategories if the parent category is selected
        if (category.children) {
          category.children.forEach(subCategory => {
            if (!this.selectedCategories.includes(subCategory)) {
              this.selectedCategories.push(subCategory);
            }
          });
        }
      } else {
        // Remove all subcategories if the parent category is deselected
        if (category.children) {
          category.children.forEach(subCategory => {
            const index = this.selectedCategories.indexOf(subCategory);
            if (index !== -1) {
              this.selectedCategories.splice(index, 1);
            }
          });
        }
      }
      this.emitFilters();
    },
    toggleSubCategory(category) {
      const allSubCategoriesSelected = category.children.every(subCategory =>
        this.selectedCategories.includes(subCategory)
      );
      if (allSubCategoriesSelected) {
        if (!this.selectedCategories.includes(category.name)) {
          this.selectedCategories.push(category.name);
        }
      } else {
        const mainCategoryIndex = this.selectedCategories.indexOf(category.name);
        if (mainCategoryIndex !== -1) {
          this.selectedCategories.splice(mainCategoryIndex, 1);
        }
      }
      this.emitFilters();
    },
    applyPriceRange(range) {
      this.minPrice = range.min;
      this.maxPrice = range.max;
      this.emitFilters();
    },
    clearAllFilters() {
      this.selectedRating = 0;
      this.selectedCategories = [];
      this.minPrice = 0;
      this.maxPrice = 5000;
      this.$refs.priceRangeSlider.reset();
      this.$emit('clear-filters');
    },
    clearCategoryFilters() {
      this.selectedCategories = [];
      this.emitFilters();
    },
    emitFilters() {
      this.$emit('apply-filters', {
        rating: this.selectedRating,
        categories: this.selectedCategories,
        minPrice: this.minPrice,
        maxPrice: this.maxPrice,
      });
    },
    areAllSubcategoriesSelected(category) {
      if (!category.children) return false;
      return category.children.every(subCategory =>
        this.selectedCategories.includes(subCategory)
      );
    },
    updateMainCategoryState(category) {
      if (this.areAllSubcategoriesSelected(category)) {
        if (!this.selectedCategories.includes(category.name)) {
          this.selectedCategories.push(category.name);
        }
      } else {
        const mainCategoryIndex = this.selectedCategories.indexOf(category.name);
        if (mainCategoryIndex !== -1) {
          this.selectedCategories.splice(mainCategoryIndex, 1);
        }
      }
    },
    initializeCategories() {
      this.categories.forEach(category => {
        if (category.children) {
          this.updateMainCategoryState(category);
        }
      });
    },
  },
  mounted() {
    this.initializeCategories();
  },
};
</script>

<style scoped>
/* .side-panel {
  min-width: 300px;
  padding: 10px;
  border-right: 1px solid #ddd;
  background-color: rgb(250, 233, 218);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
} */

.side-panel {
  min-width: 300px;
  padding: 10px;
  border-right: 1px solid #ddd;
  background-color: rgb(250, 233, 218);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  height: calc(100vh - 20px); /* Set height to viewport height minus padding */
  overflow-y: auto; /* Enable vertical scrolling */
  position: sticky; /* Make it stick to the top */
  top: 10px; /* Adjust based on your layout */

  /* Hide default scrollbar for Firefox */
  /* scrollbar-width: thin; 
  scrollbar-color: #DBB85C transparent;  */
}

/* Customize scrollbar for Chrome, Safari, and Opera */
.side-panel::-webkit-scrollbar {
  width: 4px; /* Thin scrollbar */
}

.side-panel::-webkit-scrollbar-track {
  background: transparent; /* Make the track invisible */
}

.side-panel::-webkit-scrollbar-thumb {
  background: #DBB85C; /* Scrollbar thumb color (matches your theme) */
  border-radius: 10px; /* Curved ends */
  opacity: 0.5; /* Semi-transparent by default */
  transition: opacity 0.3s ease; /* Smooth transition */
}

.side-panel::-webkit-scrollbar-thumb:hover {
  opacity: 1; /* Fully visible on hover */
}

.clear-filters-btn {
  background-color: #FE8F88;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 15px;
  width: 100%;
  font-size: 14px;
  transition: background-color 0.2s;
}

.clear-filters-btn:hover {
  background-color: #FE7770;
}

.filter-section {
  margin-bottom: 15px;
}

.filter-section h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 8px;
}

.star-rating-filter {
  display: flex;
  gap: 5px;
}

.star {
  cursor: pointer;
  font-size: 24px;
  color: #ddd;
}

.star.active {
  color: #ffcc00;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.clear-category-btn {
  background-color: #FE8F88;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.clear-category-btn:hover {
  background-color: #FE7770;
}

.category-filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding-bottom: 80px
}

.category-item {
  margin-bottom: 8px;
}

.category-item label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #555;
}

.sub-categories {
  margin-left: 15px;
}

.sub-children {
  margin-left: 15px;
}

.sub-child-item {
  margin-left: 15px;
}

.checkbox {
  background-color: white;
  border-radius: 4px;
  border: 2px solid #DBB85C
}

.sub-checkbox {
  background-color: white;
  border-radius: 4px;
  border: 1px solid #DBB85C
}

@media (max-width: 768px) {
  .side-panel {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
  }
}
</style>