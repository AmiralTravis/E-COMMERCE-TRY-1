<!-- /components/AddressSelection.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <h1 class="text-4xl font-bold text-gray-900 mb-10 tracking-tight">Select Delivery Address</h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-red-700 text-lg">
        {{ error }}
      </div>

      <!-- Address Content -->
      <div v-else class="space-y-8">
        <!-- Address Cards -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <div class="p-8">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-semibold text-gray-900">Saved Addresses</h3>
              <button
                @click="toggleNewAddressForm"
                :disabled="isAddButtonDisabled"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {{ showNewAddressForm ? 'Cancel' : 'Add New Address' }}
              </button>
            </div>

            <!-- New Address Form -->
            <div v-if="showNewAddressForm" class="mb-8">
              <div class="bg-gray-50 rounded-lg p-6 border-2 border-blue-200">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Address Details -->
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500">Full Name</label>
                      <input
                        v-model="newAddress.fullName"
                        type="text"
                        maxlength="50"
                        class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p v-if="validationErrors.fullName" class="text-red-500 text-sm mt-1">
                        {{ validationErrors.fullName }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500">Address Line 1</label>
                      <textarea
                        v-model="newAddress.addressLine1"
                        maxlength="100"
                        class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        ref="autoResizeTextarea"
                        >
                      </textarea>
                      <p v-if="validationErrors.addressLine1" class="text-red-500 text-sm mt-1">
                        {{ validationErrors.addressLine1 }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500">Address Line 2</label>
                      <textarea
                        v-model="newAddress.addressLine2"
                        maxlength="100"
                        class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        ref="autoResizeTextarea"
                        >
                      </textarea>
                      <p v-if="validationErrors.addressLine2" class="text-red-500 text-sm mt-1">
                        {{ validationErrors.addressLine2 }}
                      </p>
                    </div>
                  </div>

                  <!-- Additional Address Details -->
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-500">City</label>
                        <input
                          v-model="newAddress.city"
                          type="text"
                          maxlength="50"
                          class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p v-if="validationErrors.city" class="text-red-500 text-sm mt-1">
                          {{ validationErrors.city }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-500">State</label>
                        <input
                          v-model="newAddress.state"
                          type="text"
                          maxlength="50"
                          class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p v-if="validationErrors.state" class="text-red-500 text-sm mt-1">
                          {{ validationErrors.state }}
                        </p>
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Postal Code</label>
                        <input
                          v-model="newAddress.postalCode"
                          type="text"
                          maxlength="10"
                          class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p v-if="validationErrors.postalCode" class="text-red-500 text-sm mt-1">
                          {{ validationErrors.postalCode }}
                        </p>
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Country</label>
                        <select
                          v-model="newAddress.country"
                          class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option v-for="country in countries" :key="country.code" :value="country.name">
                            {{ country.name }}
                          </option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500">Contact Email</label>
                      <input
                        v-model="newAddress.email"
                        type="email"
                        maxlength="100"
                        class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">
                        {{ validationErrors.email }}
                      </p>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500">Contact Phone</label>
                      <div class="flex gap-2">
                        <select
                          v-model="newAddress.countryCode"
                          class="min-w-[120px] pl-2 pr-8 py-2 border-2 border-gray-200 rounded-lg"
                        >
                          <option v-for="country in countries" :key="country.code" :value="country.code">
                            +{{ country.phone.replace('+', '') }} ({{ country.code }})
                          </option>
                        </select>
                        <input
                          v-model="newAddress.phoneNumber"
                          type="tel"
                          maxlength="15"
                          class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <p v-if="validationErrors.phoneNumber" class="text-red-500 text-sm mt-1">
                        {{ validationErrors.phoneNumber }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Form Actions -->
                <div class="flex justify-end mt-6 pt-4 border-t border-gray-200">
                  <button
                    @click="saveNewAddress"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </div>
            </div>

            <!-- Existing Addresses -->
            <div class="space-y-6">
              <div
                v-for="address in localAddresses"
                :key="address.id"
                class="bg-gray-50 rounded-lg p-6 border-2"
                :class="[
                  address.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200',
                  selectedAddress?.id === address.id ? 'ring-2 ring-blue-500' : ''
                ]"
              >
                <!-- Address Type Badges -->
                <div class="mb-4 space-y-2">
                  <span 
                    v-if="address.isTemporary"
                    class="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full inline-block"
                  >
                    Temporary Address
                  </span>
                  <span
                    v-if="address.isDefault"
                    class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full inline-block"
                  >
                    Default Address
                  </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Address Details -->
                  <div class="space-y-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-500">Full Name</label>
                      <input
                        :value="editingAddressId === address.id ? editedAddress.fullName : address.fullName"
                        @input="e => editedAddress.fullName = e.target.value"
                        :readonly="editingAddressId !== address.id"
                        :class="{ 'bg-gray-100': editingAddressId !== address.id }"
                        maxlength="50"
                        type="text"
                        class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500">Address Line 1</label>
                      <textarea
                       :value="editingAddressId === address.id ? editedAddress.addressLine1 : address.addressLine1"
                        @input="e => editedAddress.addressLine1 = e.target.value"
                        :readonly="editingAddressId !== address.id"
                        :class="{ 'bg-gray-100': editingAddressId !== address.id }"
                        class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        ref="autoResizeTextarea"
                        >
                      </textarea>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500">Address Line 2</label>
                      <textarea
                       :value="editingAddressId === address.id ? editedAddress.addressLine2 : address.addressLine2"
                        @input="e => editedAddress.addressLine2 = e.target.value"
                        :readonly="editingAddressId !== address.id"
                        :class="{ 'bg-gray-100': editingAddressId !== address.id }"
                        class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        ref="autoResizeTextarea"
                        >
                      </textarea>
                    </div>
                  </div>

                  <!-- Additional Address Details -->
                  <div class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-500">City</label>
                        <input
                          :value="editingAddressId === address.id ? editedAddress.city : address.city"
                          @input="e => editedAddress.city = e.target.value"
                          :readonly="editingAddressId !== address.id"
                          :class="{ 'bg-gray-100': editingAddressId !== address.id }"
                          type="text"
                          class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-500">State</label>
                        <input
                          :value="editingAddressId === address.id ? editedAddress.state : address.state"
                          @input="e => editedAddress.state = e.target.value"
                          :readonly="editingAddressId !== address.id"
                          :class="{ 'bg-gray-100': editingAddressId !== address.id }"
                          type="text"
                          class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Postal Code</label>
                        <input
                          :value="editingAddressId === address.id ? editedAddress.postalCode : address.postalCode"
                          @input="e => editedAddress.postalCode = e.target.value"
                          :readonly="editingAddressId !== address.id"
                          :class="{ 'bg-gray-100': editingAddressId !== address.id }"
                          type="text"
                          class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <!-- <div>
                        <label class="block text-sm font-medium text-gray-500">Country</label>
                        <input
                          :value="editingAddressId === address.id ? editedAddress.country : address.country"
                          @input="e => editedAddress.country = e.target.value"
                          :readonly="editingAddressId !== address.id"
                          :class="{ 'bg-gray-100': editingAddressId !== address.id }"
                          type="text"
                          class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div> -->
                      <div>
    <label class="block text-sm font-medium text-gray-500">Country</label>
    <select
      v-if="editingAddressId === address.id"
      v-model="editedAddress.country"
      class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
    >
      <option v-for="country in countries" :key="country.code" :value="country.name">
        {{ country.name }}
      </option>
    </select>
    <input
      v-else
      :value="address.country"
      readonly
      class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100"
      type="text"
    />
  </div>
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-500">Contact Email</label>
                      <input
                        :value="editingAddressId === address.id ? editedAddress.email : address.email"
                        @input="e => editedAddress.email = e.target.value"
                        :readonly="editingAddressId !== address.id"
                        :class="{ 'bg-gray-100': editingAddressId !== address.id }"
                        type="email"
                        class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <!-- <div>
                      <label class="block text-sm font-medium text-gray-500">Contact Phone</label>
                      <input
                        :value="editingAddressId === address.id ? editedAddress.phoneNumber : address.phoneNumber"
                        @input="e => editedAddress.phoneNumber = e.target.value"
                        :readonly="editingAddressId !== address.id"
                        :class="{ 'bg-gray-100': editingAddressId !== address.id }"
                        type="tel"
                        class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div> -->
                    <div>
    <label class="block text-sm font-medium text-gray-500">Contact Phone</label>
    <div v-if="editingAddressId === address.id" class="flex gap-2">
      <select
        v-model="editedAddress.countryCode"
        class="min-w-[120px] pl-2 pr-8 py-2 border-2 border-gray-200 rounded-lg"
      >
        <option v-for="country in countries" :key="country.code" :value="country.code">
          +{{ country.phone.replace('+', '') }} ({{ country.code }})
        </option>
      </select>
      <input
        v-model="editedAddress.phoneNumber"
        type="tel"
        maxlength="15"
        class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    <input
      v-else
      :value="getFullPhoneNumber(address)"
      readonly
      class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg bg-gray-100"
      type="text"
    />
  </div>
                  </div>
                </div>

                <!-- Address Actions -->
                <div class="flex justify-between mt-6 pt-4 border-t border-gray-200">
                  <div class="flex items-center space-x-6">
                    <button
                      v-if="editingAddressId !== address.id"
                      @click="deleteAddress(address.id)"
                      class="text-red-600 hover:text-red-700 transition-colors"
                    >
                      Delete
                    </button>

                    <button
                      v-if="!address.isDefault && editingAddressId !== address.id"
                      @click="setDefault(address.id)"
                      class="text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Set as Default
                    </button>

                    <button
                      v-if="editingAddressId !== address.id"
                      @click="enterEditMode(address)"
                      class="text-gray-600 hover:text-gray-700 transition-colors"
                    >
                      Edit
                    </button>

                    <template v-if="editingAddressId === address.id">
                      <button
                        @click="cancelEdit"
                        class="text-gray-600 hover:text-gray-700 transition-colors mr-4"
                      >
                        Cancel
                      </button>
                      <button
                        @click="updateAddress(editedAddress)"
                        :disabled="!hasChanges()"
                        class="text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
                      >
                        Save
                      </button>
                    </template>
                  </div>
                  <div class="flex space-x-4">
                    <button
                      @click="selectAddress(address)"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      :class="{ 'bg-green-600 hover:bg-green-700': selectedAddress?.id === address.id }"
                    >
                      {{ selectedAddress?.id === address.id ? 'Selected' : 'Select' }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Actions -->
        <div class="flex justify-end space-x-4">
          <button
            @click="$emit('cancel')"
            class="px-6 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Cart
          </button>
          <button
            @click="confirmSelection"
            :disabled="!selectedAddress"
            type="button"
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            Use Selected Address
          </button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg   transition-opacity duration-300"
      :class="{ 'opacity-0': !showToast }"
    >
      {{ toastMessage }}
    </div>
  </div>
</template>






<script>
const VALIDATION_RULES = {
  fullName: { max: 50, message: 'Full name must be less than 50 characters' },
  addressLine1: { max: 100, message: 'Address line 1 must be less than 100 characters' },
  addressLine2: { max: 100, message: 'Address line 2 must be less than 100 characters' },
  city: { max: 50, message: 'City must be less than 50 characters' },
  state: { max: 50, message: 'State must be less than 50 characters' },
  postalCode: { 
    max: 10, 
    pattern: /^[A-Z0-9\- ]+$/,
    message: 'Postal code must be alphanumeric and less than 10 characters'
  },
  country: { max: 50, message: 'Country must be less than 50 characters' },
  email: {
    max: 100,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address'
  },
  // phoneNumber: {
  //   max: 15,
  //   pattern: /^\+?[0-9]{6,15}$/,
  //   message: 'Phone number must be between 6-15 digits'
  // }
  phoneNumber: {
  max: 15,
  pattern: /^[0-9]{6,15}$/,
  message: 'Phone number must be 6-15 digits'
}
};

export default {
  name: 'AddressSelection',
  
  props: {
    savedAddresses: {
      type: Array,
      default: () => []
    },
    initialSelected: {
      type: Object,
      default: null
    }
  },

  emits: ['selected', 'cancel', 'refresh', 'update-address', 'delete-address', 'new-address', 'set-default', 'confirm'],

  data() {
    return {
      countries: [
        { name: 'United States', code: 'US', phone: '+1' },
        { name: 'United Kingdom', code: 'GB', phone: '+44' },
        { name: 'Canada', code: 'CA', phone: '+1' },
        { name: 'Australia', code: 'AU', phone: '+61' },
        { name: 'Germany', code: 'DE', phone: '+49' },
        { name: 'France', code: 'FR', phone: '+33' },
        { name: 'Japan', code: 'JP', phone: '+81' },
        { name: 'India', code: 'IN', phone: '+91' },
        { name: 'China', code: 'CN', phone: '+86' },
        { name: 'Brazil', code: 'BR', phone: '+55' }
      ],
      localAddresses: [],
      editingAddressId: null,
      editedAddress: null,
      originalAddresses: [],
      selectedAddress: null,
      showNewAddressForm: false,
      isLoading: false,
      error: null,
      showToast: false,
      toastMessage: '',
      newAddress: this.initNewAddress(),
      validationErrors: {}
    }
  },

  computed: {
    isAddButtonDisabled() {
      const savedCount = this.savedAddresses.length;
      const hasTemp = this.localAddresses.some(addr => addr.isTemporary);
      return savedCount >= 5 && hasTemp;
    }
  },

  watch: {
    savedAddresses: {
      immediate: true,
      handler(newVal) {
        const tempAddresses = JSON.parse(sessionStorage.getItem('tempAddresses') || '[]');
        this.localAddresses = [...newVal, ...tempAddresses];
        this.originalAddresses = JSON.parse(JSON.stringify(this.localAddresses));
        this.selectedAddress = this.initialSelected;
      }
    }
  },
  watch: {
  savedAddresses: {
    immediate: true,
    handler(newVal) {
      const tempAddresses = JSON.parse(sessionStorage.getItem('tempAddresses') || '[]');
      this.localAddresses = [...newVal, ...tempAddresses];
      this.originalAddresses = JSON.parse(JSON.stringify(this.localAddresses));
      this.selectedAddress = this.initialSelected;
      this.$nextTick(() => {
        this.initAutoResize();
      });
    }
  }
},

  methods: {
    initNewAddress() {
      return {
        fullName: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
        countryCode: 'US',
        email: '',
        phoneNumber: '',
        isDefault: false
      };
    },

    validateField(field, value) {
      const rules = VALIDATION_RULES[field];
      if (!rules) return true;

      if (rules.max && value.length > rules.max) {
        return rules.message;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.message;
      }

      return true;
    },

    validateAddress(address) {
      const errors = {};
      Object.keys(VALIDATION_RULES).forEach(field => {
        const error = this.validateField(field, address[field]);
        if (error !== true) {
          errors[field] = error;
        }
      });
      return Object.keys(errors).length ? errors : true;
    },

    showValidationError(field, message) {
      this.showToastMessage(`${field}: ${message}`);
    },

    showToastMessage(message, type = 'error') {
      this.toastMessage = message;
      this.toastType = type;
      this.showToast = true;
      setTimeout(() => {
        this.showToast = false;
      }, 3000);
    },

    toggleNewAddressForm() {
    this.showNewAddressForm = !this.showNewAddressForm;
    if (!this.showNewAddressForm) {
      this.newAddress = this.initNewAddress();
    } else {
      this.$nextTick(() => {
        this.initAutoResize();
      });
    }
  },

    async saveNewAddress() {
      const validation = this.validateAddress(this.newAddress);
      if (validation !== true) {
        this.validationErrors = validation;
        Object.entries(validation).forEach(([field, error]) => {
          this.showValidationError(field, error);
        });
        return;
      }

      const isTemporary = this.localAddresses.length >= 5;
      const newAddress = { 
        ...this.newAddress, 
        id: `temp-${Date.now()}`,
        isTemporary 
      };
      
      try {
        await this.$emit('new-address', newAddress);
        this.showNewAddressForm = false;
        this.newAddress = this.initNewAddress();
        this.showToastMessage('Address added successfully', 'success');
      } catch (error) {
        console.error('Error saving new address:', error);
        this.showToastMessage('Failed to add address');
      }
    },

    selectAddress(address) {
      this.selectedAddress = address;
      this.$emit('selected', address);
    },

    async setDefault(id) {
      try {
        await this.$emit('set-default', id);
        this.showToastMessage('Default address updated', 'success');
      } catch (error) {
        console.error('Error setting default address:', error);
        this.showToastMessage('Failed to set default address');
      }
    },

    async deleteAddress(id) {
      if (!confirm('Are you sure you want to delete this address?')) return
      
      try {
        await this.$emit('delete-address', id);
        if (this.selectedAddress?.id === id) {
          this.selectedAddress = null;
        }
        this.showToastMessage('Address deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting address:', error);
        this.showToastMessage('Failed to delete address');
      }
    },
    // getFullPhoneNumber(address) {
    //   const country = this.countries.find(c => c.code === address.countryCode);
    //   return country ? `${country.phone} ${address.phoneNumber}` : address.phoneNumber;
    // },
    getFullPhoneNumber(address) {
  const country = this.countries.find(c => c.code === address.countryCode);
  return country ? `${country.phone} ${address.phoneNumber}` : address.phoneNumber;
},

    // enterEditMode(address) {
    //   this.editingAddressId = address.id;
    //   this.editedAddress = JSON.parse(JSON.stringify(address));
    // },
    enterEditMode(address) {
    this.editingAddressId = address.id;
    this.editedAddress = JSON.parse(JSON.stringify(address));
    this.$nextTick(() => {
      this.initAutoResize();
    });
  },

    cancelEdit() {
      this.editingAddressId = null;
      this.editedAddress = null;
    },

    hasChanges() {
      if (!this.editedAddress) return false;
      const original = this.originalAddresses.find(a => a.id === this.editingAddressId);
      return JSON.stringify(this.editedAddress) !== JSON.stringify(original);
    },

    async updateAddress(address) {
      const validation = this.validateAddress(address);
      if (validation !== true) {
        this.validationErrors = validation;
        Object.entries(validation).forEach(([field, error]) => {
          this.showValidationError(field, error);
        });
        return;
      }

      try {
      await this.$emit('update-address', address);
      this.editingAddressId = null;
      this.editedAddress = null;
      this.$nextTick(() => {
        this.initAutoResize();
      });
      this.showToastMessage('Address updated successfully', 'success');
    } catch (error) {
      console.error('Error updating address:', error);
      this.showToastMessage('Failed to update address');
    }
    },

    confirmSelection() {
      if (this.selectedAddress) {
        sessionStorage.setItem('selectedAddress', JSON.stringify(this.selectedAddress));
        this.$emit('confirm', this.selectedAddress);
      }
    },
    // initAutoResize() {
    //   const textareas = document.querySelectorAll('textarea');
    //   textareas.forEach(textarea => {
    //     textarea.addEventListener('input', function() {
    //       this.style.height = 'auto';
    //       this.style.height = (this.scrollHeight) + 'px';
    //     });
    //     // Initial resize
    //     textarea.dispatchEvent(new Event('input'));
    //   });
    // }
    initAutoResize() {
  const textareas = document.querySelectorAll('textarea');
  textareas.forEach(textarea => {
    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    };
    
    // Initial adjustment
    adjustHeight();
    
    // Adjust on input
    textarea.addEventListener('input', adjustHeight);
    
    // Also adjust when value is programmatically changed
    textarea.addEventListener('change', adjustHeight);
  });
},
  },

  // mounted() {
  //   this.selectedAddress = this.initialSelected;
  //   sessionStorage.removeItem('selectedAddress');
  //   this.initAutoResize();

  // }
  mounted() {
  this.selectedAddress = this.initialSelected;
  sessionStorage.removeItem('selectedAddress');
  this.$nextTick(() => {
    this.initAutoResize();
  });
}
}
</script>
<!-- 
<style>
select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
}
</style> -->



<!-- <style scoped>
.form-group label {
  margin-bottom: 0.375rem;
  display: block;
}

select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.address-card {
  transition: all 0.2s ease-in-out;
}

.address-card:hover {
  transform: translateY(-2px);
}
</style> -->
<!-- <style scoped>
select {
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1em;
  padding-right: 2.5rem;
}

.address-actions button {
  margin-right: 1.5rem;
}
</style> -->
<style scoped>
/* Proper dropdown styling */
select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.2em;
  padding-right: 2.5rem;
}

/* Auto-expanding textarea */
/* textarea {
  overflow-y: hidden;
  min-height: 60px;
  resize: none;
} */
textarea {
  overflow-y: hidden;
  min-height: 42px;
  resize: none;
  line-height: 1.5;
  transition: height 0.1s ease;
}

/* Unified card styling */
.address-card {
  transition: all 0.2s ease-in-out;
}

.address-card:hover {
  transform: translateY(-2px);
}

.address-actions button {
  margin-right: 1.5rem;
}
</style>