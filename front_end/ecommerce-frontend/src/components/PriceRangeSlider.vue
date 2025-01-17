<!-- /components/PriceRangeSlider.vue -->
<template>
  <div class="price-range-slider">
    <!-- Price Input Fields -->
    <div class="price-input-container">
      <div class="price-input">
        <div class="price-field">
          <span>Minimum Price</span>
          <input
            type="number"
            v-model="minPrice"
            :min="min"
            :max="max"
            @input="updateMinPrice"
          />
        </div>
        <div class="price-field">
          <span>Maximum Price</span>
          <input
            type="number"
            v-model="maxPrice"
            :min="min"
            :max="max"
            @input="updateMaxPrice"
          />
        </div>
      </div>
    </div>

    <!-- Slider Track -->
    <div class="slider-container">
      <div class="price-slider" :style="sliderStyle"></div>
      <div class="range-input">
        <input
          type="range"
          v-model="minPrice"
          :min="min"
          :max="max"
          step="1"
          class="min-range"
          @input="updateMinSlider"
        />
        <input
          type="range"
          v-model="maxPrice"
          :min="min"
          :max="max"
          step="1"
          class="max-range"
          @input="updateMaxSlider"
        />
      </div>
    </div>

    <p>Selected Range: ${{ minPrice }} - ${{ maxPrice }}</p>
    <button @click="applyPriceRange" class="apply-price-range-btn">Go!</button>
  </div>
</template>

<script>
export default {
  name: "PriceRangeSlider",
  props: {
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 5000,
    },
    priceGap: {
      type: Number,
      default: 100,
    },
    initialMinPrice: {
      type: Number,
      default: 0,
    },
    initialMaxPrice: {
      type: Number,
      default: 5000,
    },
  },
  data() {
    return {
      minPrice: this.initialMinPrice, // Initialize with initialMinPrice
      maxPrice: this.initialMaxPrice, // Initialize with initialMaxPrice
    };
  },
  watch: {
    // Watch for changes in initialMinPrice and update minPrice
    initialMinPrice(newMinPrice) {
      this.minPrice = newMinPrice;
    },
    // Watch for changes in initialMaxPrice and update maxPrice
    initialMaxPrice(newMaxPrice) {
      this.maxPrice = newMaxPrice;
    },
  },
  computed: {
    sliderStyle() {
      const left = ((this.minPrice - this.min) / (this.max - this.min)) * 100;
      const right = 100 - ((this.maxPrice - this.min) / (this.max - this.min)) * 100;
      return {
        left: `${left}%`,
        right: `${right}%`,
      };
    },
  },
  methods: {
    updateMinPrice(event) {
      let value = parseInt(event.target.value);
      if (value < this.min) value = this.min;
      if (value > this.maxPrice - this.priceGap) {
        value = this.maxPrice - this.priceGap;
      }
      this.minPrice = value;
    },
    updateMaxPrice(event) {
      let value = parseInt(event.target.value);
      if (value > this.max) value = this.max;
      if (value < this.minPrice + this.priceGap) {
        value = this.minPrice + this.priceGap;
      }
      this.maxPrice = value;
    },
    updateMinSlider(event) {
      let value = parseInt(event.target.value);
      if (value > this.maxPrice - this.priceGap) {
        value = this.maxPrice - this.priceGap;
      }
      this.minPrice = value;
    },
    updateMaxSlider(event) {
      let value = parseInt(event.target.value);
      if (value < this.minPrice + this.priceGap) {
        value = this.minPrice + this.priceGap;
      }
      this.maxPrice = value;
    },
    applyPriceRange() {
      this.$emit('apply-price-range', {
        min: this.minPrice,
        max: this.maxPrice,
      });
    },
    reset() {
      this.minPrice = this.min; // Reset to default min
      this.maxPrice = this.max; // Reset to default max
      this.applyPriceRange(); // Emit the reset values
    },
  },
};
</script>

<style scoped>
.price-range-slider {
  width: 100%;
  padding: 10px;
  /* background: white; */
  background-color: rgb(254, 244, 234);

  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.price-input-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.price-input {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.price-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.price-field span {
  font-size: 14px;
  color: #555;
}

.price-field input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.slider-container {
  position: relative;
  height: 6px;
  background: #e4e4e4;
  border-radius: 5px;
  margin-bottom: 20px;
}

.price-slider {
  height: 100%;
  background: #dbb95d;
  border-radius: 5px;
  position: absolute;
}

.range-input {
  position: relative;
  height: 6px;
}

.range-input input[type="range"] {
  position: absolute;
  width: 100%;
  height: 6px;
  background: none;
  top: 0;
  pointer-events: none;
  -webkit-appearance: none;
}

.range-input input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #cea532;
  pointer-events: auto;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.range-input input[type="range"]::-moz-range-thumb {
  height: 18px;
  width: 18px;
  border-radius: 50%;
  background: #3498db;
  pointer-events: auto;
  cursor: pointer;
  position: relative;
  z-index: 2;
}

.apply-price-range-btn {
  background-color: #DBB85C;
  color: #FEF5EB;
  border: 2px solid #FEF5EB;
  padding: 8px 16px;
  border-radius: 60px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
  font-weight: 600;
  margin-top: 10px;
}

.apply-price-range-btn:hover {
  background-color: #FEF5EB;
  color: #DBB85C;
  border: 2px solid #DBB85C;

}

@media (max-width: 768px) {
  .price-range-slider {
    width: 100%;
  }
}
</style>