<!-- components/HomeFrontend.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Carousel Section (Enhanced from original) -->
    <section class="hero-carousel relative h-[600px] overflow-hidden">
      <div 
        class="carousel-inner flex transition-transform duration-700"
        :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
      >
        <div 
          v-for="(slide, index) in heroSlides" 
          :key="index"
          class="carousel-slide flex-shrink-0 w-full relative"
        >
          <img 
            :src="slide.image" 
            :alt="slide.title"
            class="w-full h-[600px] object-cover"
          />
          <div class="absolute inset-0 bg-black/15 flex items-center justify-center">
            <div class="text-center text-white px-4 max-w-2xl">
              <h2 class="text-6xl font-bold mb-6 drop-shadow-lg">{{ slide.title }}</h2>
              <p class="text-xl mb-8 drop-shadow-md">{{ slide.description }}</p>
              
              <button 
                @click="applyHeroBannerFilter(slide)"
                class="bg-primary text-white px-8 py-4 rounded-full hover:bg-primary-dark transition duration-300 text-lg font-semibold transform hover:scale-105"
              >
                {{ slide.type === 'offer' ? 'Shop Now' : `Shop ${slide.title}` }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Navigation Buttons -->
      <button 
        @click="prevSlide" 
        class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 p-3 rounded-full hover:bg-white/50 transition backdrop-blur-sm transform hover:scale-110"
      >
        <span class="text-2xl">←</span>
      </button>
      <button 
        @click="nextSlide" 
        class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 p-3 rounded-full hover:bg-white/50 transition backdrop-blur-sm transform hover:scale-110"
      >
        <span class="text-2xl">→</span>
      </button>

      <!-- Enhanced Slide Indicators -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3">
        <button 
          v-for="(slide, index) in heroSlides" 
          :key="index"
          @click="goToSlide(index)"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="currentSlide === index ? 'bg-primary scale-125' : 'bg-white/50 hover:bg-white/75'"
        ></button>
      </div>
    </section>

    <!-- Featured Categories Section (Enhanced from original) -->
    <!-- <section class="featured-categories py-16">
      <div class="mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Featured Categories</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div 
            v-for="category in mainCategories" 
            :key="category.name" 
            class="category-card p-8 rounded-xl text-center transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg"
            :style="{ backgroundColor: category.color }"
            @click="applyCategoryFilter(category)"
          >
            <h3 class="text-xl font-semibold text-white">{{ category.name }}</h3>
            <p class="text-white/80 mt-2 text-sm">
              
            </p>
          </div>
        </div>
      </div>
    </section> -->
     <!-- Enhanced Featured Categories Section -->
  <section class="featured-categories py-16 bg-gradient-to-b from-gray-50 to-white">
    <div class="mx-auto px-4">
      <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
        <span class="relative">
          Featured Categories
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
        </span>
      </h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div 
          v-for="category in mainCategories" 
          :key="category.name" 
          class="category-card group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
          :style="{ background: `linear-gradient(135deg, ${category.gradientStart}, ${category.gradientEnd})` }"
          @click="applyCategoryFilter(category)"
        >
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-white/10"></div>
          <div class="absolute -right-12 -bottom-12 w-32 h-32 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700"></div>
          <div class="relative p-8 h-full flex flex-col justify-between">
            <h3 class="text-xl font-bold text-white text-center group-hover:transform group-hover:translate-y-0 transition-transform duration-500">
              {{ category.name }}
            </h3>
            <p class="text-white/80 mt-2 text-sm opacity-0 text-center group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
              {{ category.subcategories.length }} items
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
    <!-- Best Sellers Section (New) -->
    <section class="best-seller bg-white ">
      <div class=" mx-auto px-16">
        <h2 class="text-4xl font-bold text-center mt-6 mb-8 text-gray-800">
          <span class="relative">
            Best Sellers
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
        </span>
        </h2>
        <BestsellerCarousel />
      </div>
    </section>

    <!-- New Arrivals Section (New) -->
    <section class="new-arrivals bg-white ">
      <div class="">
        
        <NewArrivalsCarousel  />
      </div>
    </section>      
 
    <!-- Discounted Products Section (New) -->
    <section class="discount-section bg-gray-50">
    <div class="mx-auto px-4">
      <h2 class="text-4xl font-bold mb-12 text-center text-gray-800">
        <span class="relative">
          Special Offers
          <span class="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
        </span>
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Main Sale Banner -->
        <div 
          class="md:col-span-2 rounded-2xl overflow-hidden relative group cursor-pointer transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
          @click="applyOfferFilters(1, 70)"
        >
          <img src="@/assets/sale_banner.jpg" alt="Sale Banner" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"> 
          <div class="absolute inset-0 bg-gradient-to-r from-red-100/90 to-red-300/90 mix-blend-multiply"></div>
          <div class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-x-48 -translate-y-48 group-hover:scale-150 transition-transform duration-700"></div>
          <div class="relative p-12 text-white">
            <span class="inline-block bg-white/20 px-6 py-2 rounded-full text-sm mb-6 backdrop-blur-sm">Limited Time</span>
            <h3 class="text-5xl font-bold mb-6">Holiday Season Sale</h3>
            <p class="text-8xl font-black mb-8 tracking-tight"><span class="text-2xl align-top mr-2">up to</span>70% OFF</p>
            <button 
              class="bg-white text-red-600 px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              @click.stop="applyOfferFilters(1, 70, ['Fashion & Accessories', 'Beauty & Health'])"
            >
              Shop Now
            </button>
          </div>
        </div>
        
        <!-- Smaller Sale Cards -->
        <div class="space-y-6">
          <!-- Flash Sale -->
          <div 
            class="rounded-2xl overflow-hidden relative group cursor-pointer transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
            @click="applyOfferFilters(45, 55, ['Fashion & Accessories', 'Beauty & Health'])"
          >
            <img src="@/assets/flash_sale.jpg" alt="Flash Sale" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-pink-500/90 mix-blend-multiply"></div>
            <div class="relative p-8 text-white">
              <h3 class="text-3xl font-bold mb-2">Flash Sale</h3>
              <p class="text-5xl font-bold"><span class="text-xl align-top mr-2">flat</span>50% OFF</p>
              <span class="inline-block mt-4 text-sm bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">Ends in 24h</span>
            </div>
          </div>
          
          <!-- Daily Deal -->
          <div 
            class="rounded-2xl overflow-hidden relative group cursor-pointer transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]"
            @click="applyOfferFilters(1, 40, ['Electronics', 'Home Appliances'])"
          >
            <img src="@/assets/daily_deal.jpg" alt="Daily Deal" class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-yellow-300/90 mix-blend-multiply"></div>
            <div class="relative p-8 text-white">
              <h3 class="text-3xl font-bold mb-2">Daily Deal</h3>
              <p class="text-lg mb-2">on Electronics and Home Appliances</p>
              <p class="text-5xl font-bold"><span class="text-xl align-top mr-2">up to</span>40% OFF</p>
              <span class="inline-block mt-4 text-sm bg-white/20 px-4 py-1 rounded-full backdrop-blur-sm">Today Only</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

    <!-- Recommended Section (New) -->
   
    <section class="recommended-section bg-white ">
      <div >
      
        <SuggestedProducts  />
      </div>
    </section> 

    <!-- Brands Section (New) -->
    
    <section class="brand-logo-carousel bg-white ">
      <div>
  
        <LogoCarousel  />
      </div>
    </section> 

  </div>
</template>




<script>


import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useCartStore } from '../../stores/cart';
import { useRouter } from 'vue-router';
import { useFilterStore } from '@/stores/useFilterStore';
import BestsellerCarousel from '@/components/homepage_components/BestsellerCarousel.vue';
import NewArrivalsCarousel from '@/components/homepage_components/NewArrivalsCarousel.vue';
import SuggestedProducts from '@/components/homepage_components/SuggestedProducts.vue';
import LogoCarousel from '@/components/homepage_components/LogoCarousel.vue';


// Import images (adjust paths as needed)
import holidaySaleImage from '@/assets/holiday_sale.jpg';
import flashSaleImage from '@/assets/flash_saleHero.jpg';
import techImage from '@/assets/hero-tech-gadgets.jpg';
import officeImage from '@/assets/hero-office-furniture.jpg';
import fashionImage from '@/assets/hero-fashion-accessories.jpeg';
import beautyImage from '@/assets/hero-beauty-health.jpeg';
import entertainmentImage from '@/assets/hero-entertainment-hobbies.jpeg';
import kitchenImage from '@/assets/hero-kitchen-appliances.jpg';


// Temporary data for under-development sections
const temporaryData = {
  
  recommendedProducts: [
    { id: 1, name: "Recommended 1", price: 89.99, reviews: 150 },
    { id: 2, name: "Recommended 2", price: 129.99, reviews: 230 }
  ],
  brandLogos: [
    { id: 1, name: "Brand 1" },
    { id: 2, name: "Brand 2" },
    { id: 3, name: "Brand 3" }
  ]
};

export default {
  name: 'HomeFrontend',
  components: {
    BestsellerCarousel,
    NewArrivalsCarousel,
    SuggestedProducts,
    LogoCarousel,
  },
  setup() {
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    const router = useRouter();
    const filterStore = useFilterStore();

    // Add missing reactive properties
    
    const currentNewArrival = ref(0);
    const isPaused = ref(false);
    
    // Navigation methods for new arrivals
    const nextNewArrival = () => {
      currentNewArrival.value = (currentNewArrival.value + 1) % temporaryData.newArrivals.length;
    };
    
    const prevNewArrival = () => {
      currentNewArrival.value = (currentNewArrival.value - 1 + temporaryData.newArrivals.length) % temporaryData.newArrivals.length;
    };

    // Brand scroll management
    const pauseScroll = () => {
      isPaused.value = true;
    };
    
    const resumeScroll = () => {
      isPaused.value = false;
    };

    // Hero Slides Data
    const heroSlides = ref([
    {
        type: 'offer',
        image: holidaySaleImage,
        title: 'Holiday Sale',
        description: 'Enjoy Up to 70% Off on Selected Items!',
        discountRange: { min: 1, max: 70 },
        // categories: ['Fashion & Accessories', 'Beauty & Health', 'Home Appliances']
      },
      // New Flash Sale Slide
      {
        type: 'offer',
        image: flashSaleImage,
        title: 'Flash Sale',
        description: 'Flat 50% Off on Fashion, Beauty products and more!',
        discountRange: { min: 45, max: 55 },
        categories: ['Fashion & Accessories', 'Clothing', 'Watches', 'Shoes', 'Bags', 'Beauty & Health', 'Skin Care', 'Toothbrushes', 'Fitness Equipment']
      },
      {
        image: techImage,
        title: 'Tech & Electronics',
        description: 'Discover the Latest Cutting-Edge Gadgets'
      },
      {
        image: officeImage,
        title: 'Office & Furniture',
        description: 'Create Your Perfect Workspace'
      },
      {
        image: fashionImage,
        title: 'Fashion & Accessories',
        description: 'Elevate Your Style with Luxury Brands'
      },
      {
        image: beautyImage,
        title: 'Beauty & Health',
        description: 'Premium Skincare and Wellness Products'
      },
      {
        image: entertainmentImage,
        title: 'Entertainment & Hobbies',
        description: 'Unlock Your Leisure Time Potential'
      },
      {
        image: kitchenImage,
        title: 'Kitchen & Appliances',
        description: 'Modern Cooking Essentials'
      }
    ]);

    // Carousel Logic
    const currentSlide = ref(0);
    const slideInterval = ref(null);

    const nextSlide = () => {
      currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length;
      resetAutoSlide(); // Reset the auto-slide interval after manual navigation
    };

    const prevSlide = () => {
      currentSlide.value = (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length;
      resetAutoSlide(); // Reset the auto-slide interval after manual navigation
    };

    const goToSlide = (index) => {
      currentSlide.value = index;
      resetAutoSlide(); // Reset the auto-slide interval after manual navigation
    };

    const startAutoSlide = () => {
      slideInterval.value = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    };

    const stopAutoSlide = () => {
      if (slideInterval.value) {
        clearInterval(slideInterval.value);
        slideInterval.value = null;
      }
    };

    const resetAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    // Pause carousel when the tab is not visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAutoSlide(); // Pause the carousel when the tab is inactive
      } else {
        startAutoSlide(); // Resume the carousel when the tab becomes active
      }
    };

    onMounted(() => {
      startAutoSlide();
      document.addEventListener('visibilitychange', handleVisibilityChange); // Listen for visibility changes
    });

    onUnmounted(() => {
      stopAutoSlide();
      document.removeEventListener('visibilitychange', handleVisibilityChange); // Clean up the event listener
    });


    // Featured Categories Data
    // const mainCategories = ref([
    //   {
    //     name: 'Electronics',
    //     color: '#FF6F61',
    //     subcategories: ['Laptops', 'Smartphones', 'Wearables', 'Headphones', 'Cameras', 'Streaming Devices', 'Gaming Consoles', 'Printers', 'Speakers', 'Books & E-Readers']
    //   },
    //   {
    //     name: 'Home Appliances',
    //     color: '#6B5B95',
    //     subcategories: ['Kitchen Appliances', 'Air Purifiers', 'Vacuum Cleaners']
    //   },
    //   {
    //     name: 'Furniture & Office Supplies',
    //     color: '#88B04B',
    //     subcategories: ['Ergonomic Chairs', 'Desks and Tables']
    //   },
    //   {
    //     name: 'Fashion & Accessories',
    //     color: '#F7CAC9',
    //     subcategories: ['Clothing', 'Watches', 'Shoes', 'Bags']
    //   },
    //   {
    //     name: 'Beauty & Health',
    //     color: '#92A8D1',
    //     subcategories: ['Skin Care', 'Toothbrushes', 'Fitness Equipment']
    //   },
    //   {
    //     name: 'Entertainment & Hobbies',
    //     color: '#955251',
    //     subcategories: ['Toys & Collectibles', 'Cutting Machines']
    //   },
    //   {
    //     name: 'Outdoor & Travel',
    //     color: '#B565A7',
    //     subcategories: ['Camping Gear', 'Water Bottles', 'Pizza Ovens']
    //   },
    //   {
    //     name: 'Smart Home & IoT',
    //     color: '#009B77',
    //     subcategories: ['Video Doorbells', 'Security Cameras']
    //   }
    // ]);
    const mainCategories = ref([
  {
    name: 'Electronics',
    gradientStart: '#FF6B6B',
    gradientEnd: '#FF8E8E',
    subcategories: ['Laptops', 'Smartphones', 'Wearables', 'Headphones', 'Cameras', 'Streaming Devices', 'Gaming Consoles', 'Printers', 'Speakers', 'Books & E-Readers']
  },
  {
    name: 'Home Appliances',
    gradientStart: '#4E54C8',
    gradientEnd: '#8F94FB',
    subcategories: ['Kitchen Appliances', 'Air Purifiers', 'Vacuum Cleaners']
  },
  {
    name: 'Furniture & Office',
    gradientStart: '#11998E',
    gradientEnd: '#38EF7D',
    subcategories: ['Ergonomic Chairs', 'Desks and Tables']
  },
  {
    name: 'Fashion',
    gradientStart: '#FC466B',
    gradientEnd: '#3F5EFB',
    subcategories: ['Clothing', 'Watches', 'Shoes', 'Bags']
  },
  {
    name: 'Beauty & Health',
    gradientStart: '#A8E6CF',
    gradientEnd: '#DCEDC1',
    subcategories: ['Skin Care', 'Toothbrushes', 'Fitness Equipment']
  },
  {
    name: 'Entertainment',
    gradientStart: '#FFD93D',
    gradientEnd: '#FF8E8E',
    subcategories: ['Toys & Collectibles', 'Cutting Machines']
  },
  {
    name: 'Outdoor & Travel',
    gradientStart: '#6983aa',
    gradientEnd: '#90B8F8',
    subcategories: ['Camping Gear', 'Water Bottles', 'Pizza Ovens']
  },
  {
    name: 'Smart Home',
    gradientStart: '#43C6AC',
    gradientEnd: '#191654',
    subcategories: ['Video Doorbells', 'Security Cameras']
  }
]);
    // Function to apply category filters
    
    const applyCategoryFilter = (category) => {
      router.push({
        path: '/products',
        query: {
          categories: [category.name, ...category.subcategories].join(','),
          minPrice: 0,
          maxPrice: 5000,
          rating: '', // Explicitly reset rating filter
        }
      }).then(() => {
    // Scroll to top after the route change and component is rendered
    nextTick(() => {
      window.scrollTo(0, 0); // or document.documentElement.scrollTop = 0;
    });
  });
    };

    // Update hero banner filters too
    
    const applyHeroBannerFilter = (slide) => {
      if (slide.type === 'offer') {
        applyOfferFilters(
          slide.discountRange.min,
          slide.discountRange.max,
          slide.categories
        );
      } else {
      const categoryMap = {
        // 'Flash Sale': ['Fashion & Accessories', 'Clothing', 'Watches', 'Shoes', 'Bags', 'Beauty & Health', 'Skin Care', 'Toothbrushes', 'Fitness Equipment'],
        'Tech & Electronics': ['Electronics', 'Laptops', 'Smartphones', 'Wearables', 'Headphones', 'Cameras', 'Streaming Devices', 'Gaming Consoles', 'Printers', 'Speakers', 'Books & E-Readers'],
        'Office & Furniture': ['Furniture & Office Supplies', 'Ergonomic Chairs', 'Desks and Tables'],
        'Fashion & Accessories': ['Fashion & Accessories', 'Clothing', 'Watches', 'Shoes', 'Bags'],
        'Beauty & Health': ['Beauty & Health', 'Skin Care', 'Toothbrushes', 'Fitness Equipment'],
        'Entertainment & Hobbies': ['Entertainment & Hobbies', 'Toys & Collectibles', 'Cutting Machines'],
        'Kitchen & Appliances': ['Home Appliances', 'Kitchen Appliances', 'Air Purifiers', 'Vacuum Cleaners'],
      };

      const categories = categoryMap[slide.title] || [];
      router.push({
        path: '/products',
        query: {
          categories: categories.join(','),
          minPrice: 0,
          maxPrice: 5000,
          rating: '', // Explicitly reset rating filter
        },
      });
    }
  }
  

    // Featured Products Data
    const featuredProducts = [
      { id: 1, name: "Smart Watch", price: 199.99, imageWidth: 200, imageHeight: 200 },
      { id: 2, name: "Wireless Earbuds", price: 89.99, imageWidth: 200, imageHeight: 200 },
      { id: 3, name: "Laptop Pro", price: 999.99, imageWidth: 200, imageHeight: 200 },
      { id: 4, name: "4K Monitor", price: 299.99, imageWidth: 200, imageHeight: 200 }
    ];

    // Add to Cart Function
    const addToCart = (product) => {
      if (authStore.isAuthenticated) {
        cartStore.addToCart(product);
      } else {
        alert('Please log in to add items to your cart.');
      }
    };

 
    const applyOfferFilters = (minDiscount, maxDiscount, categories) => {
      const queryParams = {
        discountRanges: JSON.stringify([{ min: minDiscount, max: maxDiscount }])
      };

      if (categories && categories.length > 0) { // Check if categories is defined and not empty
        queryParams.categories = categories.join(',');
      }

      router.push({
        path: '/products',
        query: queryParams
      }).then(() => {
    // Scroll to top after the route change and component is rendered
    nextTick(() => {
      window.scrollTo(0, 0); // or document.documentElement.scrollTop = 0;
    });
  })
    };



    return {
      heroSlides,
      currentSlide,
      nextSlide,
      prevSlide,
      goToSlide,
      mainCategories,
      applyCategoryFilter,
      applyHeroBannerFilter,
      addToCart,
      currentNewArrival,
      nextNewArrival,
      prevNewArrival,
      isPaused,
      pauseScroll,
      resumeScroll,
      newArrivals: temporaryData.newArrivals,
      applyOfferFilters,
      recommendedProducts: temporaryData.recommendedProducts,
      brandLogos: temporaryData.brandLogos,
    };
  }
}

</script>

<style scoped>
/* Import Poppins font from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* Apply Poppins font to the entire homepage */
.home {
  font-family: 'Poppins', sans-serif;
}

.hero-carousel {
  height: 500px;
  /* border-radius: 10px; */
}

.carousel-slide {
  position: relative;
}

.carousel-slide img {
  filter: brightness(0.8);
}

.carousel-slide h2 {
  font-weight: 700; /* Bold for headings */
  letter-spacing: -0.05em;
}

.carousel-slide p {
  font-weight: 400; /* Regular for descriptions */
}

.carousel-slide a {
  transition: transform 0.3s ease;
}

.carousel-slide a:hover {
  transform: translateY(-2px);
}

.featured-categories {
  
  background-color: #f9fafb; /* Light background for the section */
  padding: 4rem 0;
  margin-top: 0rem;

}

/* .category-card {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.category-card:hover {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
} */
.category-card {
  /* display: flex;  */

  height: 180px;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  isolation: isolate;
  flex-direction: column; /* Stack elements vertically */
  align-items: center; /* Center horizontally */
  justify-content: center; /* Center vertically */

}
.category-card .relative { /* Target the inner div */
    display: flex;
    flex-direction: column;
    align-items: center; /* Center horizontally */
    flex-grow: 1; /* Allow the content area to grow */
    justify-content: center; /* Center vertically within the content area */
}

.category-card h3 {
    text-align: center; /* Center text within the h3 */
    /* Remove transform and transition from h3 */
}




.category-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

/* .category-card:hover::before {
  opacity: 1;
} */


.best-seller {
  padding-bottom: 30px;
}

.bestseller-card {
  border: 1px solid #e8e8e8;
}

.new-arrivals{
  padding-left: 4rem;
  padding-right: 4rem;
  padding-bottom: 1rem;
}

.discount-section{
  padding-bottom: 4em;
}

.product-grid {
  max-width: 1200px;
  margin: 0 auto;
}

.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
}

.price {
  font-size: 1.1rem;
  font-weight: 500;
  color: #10b981;
  margin: 0.5rem 0;
}

.add-to-cart, .view-details {
  display: block;
  text-align: center;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border-radius: 4px;
  background: #f3f4f6;
  color: #1f2937;
  text-decoration: none;
  transition: background 0.3s ease;
}

.add-to-cart:hover, .view-details:hover {
  background: #e5e7eb;
}

.smaller-text {
  font-size: 0.3em; 
  vertical-align: top; 
  margin-right: 0.2em; 
  font-family: monospace; 
  font-weight: normal; 
}

.smaller-text-smalbox{
  font-size: 0.5em; 
  vertical-align: top; 
  margin-right: 0.2em; 
  font-family: monospace; 
  font-weight: normal; 
}

.recommended-section {
  padding-left: 4rem;
  padding-right: 4rem;
}

.brand-logo-carousel{
  padding-bottom: 4rem;
  padding-top: 4rem;
}
</style>