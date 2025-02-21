<!-- /components/DiscountRangeSlider.vue -->
<template>
    <div class="discount-range-slider">
      
      <h3 class="title">Discount Range</h3>
  
      <!-- Slider Track -->
      <div class="slider-container">
        <div class="discount-slider" :style="sliderStyle"></div>
        <div class="range-input">
          <input
            type="range"
            v-model="minDiscount"
            :min="min"
            :max="max"
            step="1"
            class="min-range"
            @input="updateMinSlider"
          />
          <input
            type="range"
            v-model="maxDiscount"
            :min="min"
            :max="max"
            step="1"
            class="max-range"
            @input="updateMaxSlider"
          />
        </div>
      </div>
  
      <p>Selected Range: {{ minDiscount }}% - {{ maxDiscount }}%</p>
      <button @click="applyDiscountRange" class="apply-discount-range-btn">Go!</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "DiscountRangeSlider",
    props: {
      min: {
        type: Number,
        default: 0,
      },
      max: {
        type: Number,
        default: 100,
      },
      discountGap: {
        type: Number,
        default: 5,
      },
      initialDiscountRanges: {
        type: Array,
        default: () => [{ min: 0, max: 100 }],
      },
    },
    data() {
      return {
        minDiscount: this.initialDiscountRanges[0]?.min || this.min,
        maxDiscount: this.initialDiscountRanges[0]?.max || this.max,
      };
    },
    watch: {
      initialDiscountRanges: {
        handler(newRanges) {
          if (newRanges && newRanges.length > 0) {
            this.minDiscount = newRanges[0].min;
            this.maxDiscount = newRanges[0].max;
          }
        },
        deep: true
      }
    },
    computed: {
      sliderStyle() {
        const left = ((this.minDiscount - this.min) / (this.max - this.min)) * 100;
        const right = 100 - ((this.maxDiscount - this.min) / (this.max - this.min)) * 100;
        return {
          left: `${left}%`,
          right: `${right}%`,
        };
      },
    },
    methods: {
      updateMinDiscount(event) {
        let value = parseInt(event.target.value);
        if (value < this.min) value = this.min;
        if (value > this.maxDiscount - this.discountGap) {
          value = this.maxDiscount - this.discountGap;
        }
        this.minDiscount = value;
      },
      updateMaxDiscount(event) {
        let value = parseInt(event.target.value);
        if (value > this.max) value = this.max;
        if (value < this.minDiscount + this.discountGap) {
          value = this.minDiscount + this.discountGap;
        }
        this.maxDiscount = value;
      },
      updateMinSlider(event) {
        let value = parseInt(event.target.value);
        if (value > this.maxDiscount - this.discountGap) {
          value = this.maxDiscount - this.discountGap;
        }
        this.minDiscount = value;
      },
      updateMaxSlider(event) {
        let value = parseInt(event.target.value);
        if (value < this.minDiscount + this.discountGap) {
          value = this.minDiscount + this.discountGap;
        }
        this.maxDiscount = value;
      },
      applyDiscountRange() {
        this.$emit('apply-discount-range', [{
          min: this.minDiscount,
          max: this.maxDiscount
        }]);
      },
      reset() {
        this.minDiscount = this.min;
        this.maxDiscount = this.max;
        this.applyDiscountRange();
      },
    },
  };
  </script>
  

  
  <style scoped>
  .title{
    margin: 0px 0px 20px;
  }

  .discount-range-slider {
    width: 100%;
    padding: 15px 10px;
    background-color: rgb(254, 244, 234);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .discount-input-container {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  .discount-input {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .discount-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .discount-field span {
    font-size: 14px;
    color: #555;
  }
  
  .discount-field input {
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
  
  .discount-slider {
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
  
  .apply-discount-range-btn {
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
  
  .apply-discount-range-btn:hover {
    background-color: #FEF5EB;
    color: #DBB85C;
    border: 2px solid #DBB85C;
  }
  
  @media (max-width: 768px) {
    .discount-range-slider {
      width: 100%;
    }
  }
  </style>