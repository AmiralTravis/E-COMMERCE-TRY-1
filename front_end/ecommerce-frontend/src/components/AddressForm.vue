<!-- components/AddressForm.vue -->
<template>
  <div class="bg-gray-50 rounded-lg p-6 border-2 border-blue-200">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Address Details -->
      <div class="space-y-4">
        <!-- Full Name Field -->
        <div>
          <label class="block text-sm font-medium text-gray-500">Full Name</label>
          <input
            v-model="formData.fullName"
            type="text"
            maxlength="50"
            class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="errors.fullName" class="text-red-500 text-sm mt-1">
            {{ errors.fullName }}
          </p>
        </div>

        <!-- Address Line 1 Field -->
        <div>
          <label class="block text-sm font-medium text-gray-500">Address Line 1</label>
          <input
            v-model="formData.addressLine1"
            type="text"
            maxlength="100"
            class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="errors.addressLine1" class="text-red-500 text-sm mt-1">
            {{ errors.addressLine1 }}
          </p>
        </div>

        <!-- Address Line 2 Field -->
        <div>
          <label class="block text-sm font-medium text-gray-500">Address Line 2</label>
          <input
            v-model="formData.addressLine2"
            type="text"
            maxlength="100"
            class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="errors.addressLine2" class="text-red-500 text-sm mt-1">
            {{ errors.addressLine2 }}
          </p>
        </div>

        <!-- City Field -->
        <div>
          <label class="block text-sm font-medium text-gray-500">City</label>
          <input
            v-model="formData.city"
            type="text"
            maxlength="50"
            class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="errors.city" class="text-red-500 text-sm mt-1">
            {{ errors.city }}
          </p>
        </div>

        <!-- State/Province Field -->
        <div>
          <label class="block text-sm font-medium text-gray-500">State/Province</label>
          <input
            v-model="formData.state"
            type="text"
            maxlength="50"
            class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="errors.state" class="text-red-500 text-sm mt-1">
            {{ errors.state }}
          </p>
        </div>

        <!-- Postal Code Field -->
        <div>
          <label class="block text-sm font-medium text-gray-500">Postal Code</label>
          <input
            v-model="formData.postalCode"
            type="text"
            maxlength="20"
            class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="errors.postalCode" class="text-red-500 text-sm mt-1">
            {{ errors.postalCode }}
          </p>
        </div>

        <!-- Country Field -->
        <div>
          <label class="block text-sm font-medium text-gray-500">Country</label>
          <select
            v-model="formData.country"
            class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option v-for="country in countries" :key="country.code" :value="country.code">
              {{ country.name }}
            </option>
          </select>
          <p v-if="errors.country" class="text-red-500 text-sm mt-1">
            {{ errors.country }}
          </p>
        </div>

        <!-- Phone Number Field -->
        <div>
          <label class="block text-sm font-medium text-gray-500">Contact Phone</label>
          <div class="flex gap-2">
            <select
              v-model="formData.countryCode"
              class="min-w-[120px] pl-2 pr-8 py-2 border-2 border-gray-200 rounded-lg"
            >
              <option v-for="country in countries" :key="country.code" :value="country.code">
                +{{ country.phone.replace('+', '') }} ({{ country.code }})
              </option>
            </select>
            <input
              v-model="formData.phoneNumber"
              type="tel"
              maxlength="15"
              class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <p v-if="errors.phoneNumber" class="text-red-500 text-sm mt-1">
            {{ errors.phoneNumber }}
          </p>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end mt-6 pt-4 border-t border-gray-200 gap-4">
      <button
        @click="cancel"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
      >
        Cancel
      </button>
      <button
        @click="submit"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {{ saveButtonText }}
      </button>
    </div>
  </div>
  <!-- Add this to the template section -->
<div>
  <label class="block text-sm font-medium text-gray-500">Contact Email</label>
  <input
    v-model="formData.email"
    type="email"
    maxlength="100"
    class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
  />
  <p v-if="errors.email" class="text-red-500 text-sm mt-1">
    {{ errors.email }}
  </p>
</div>
</template>

<script>
const VALIDATION_RULES = {
  fullName: {
    required: true,
    max: 50,
    message: 'Full name is required and must be less than 50 characters'
  },
  addressLine1: {
    required: true,
    max: 100,
    message: 'Address line 1 is required and must be less than 100 characters'
  },
  city: {
    required: true,
    max: 50,
    message: 'City is required and must be less than 50 characters'
  },
  state: {
    required: true,
    max: 50,
    message: 'State/Province is required and must be less than 50 characters'
  },
  postalCode: {
    required: true,
    max: 20,
    message: 'Postal code is required and must be less than 20 characters'
  },
  // country: {
  //   required: true,
  //   message: 'Country is required'
  // },
  // phoneNumber: {
  //   required: true,
  //   max: 15,
  //   // pattern: /^[0-9]{6,15}$/,
  //   // message: 'Phone number must be 6-15 digits'
  //   pattern: /^\+?[0-9]{6,15}$/, // Allow optional '+' prefix
  //   message: 'Phone number must be 6-15 digits'
  // },
  // email: {
  //   required: true,
  //   max: 50,
  //   pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  //   message: 'Valid email is required'
  // },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Valid email is required'
  },
  country: {
    required: true,
    message: 'Country is required'
  },
  // Update phoneNumber rule
  phoneNumber: {
    required: true,
    pattern: /^[0-9]{6,15}$/, // Remove + validation here
    message: 'Phone number must be 6-15 digits'
  }
};

export default {
  emits: ['save', 'cancel'],

  props: {
    initialData: {
      type: Object,
      default: () => ({})
    },
    countries: {
      type: Array,
      required: true
    },
    saveButtonText: {
      type: String,
      default: 'Save Address'
    }
  },

  data() {
    return {
      formData: this.parseAddress(this.initialData),
      errors: {}
    };
  },

  methods: {
    parseAddress(address) {
      const parsedPhone = this.parsePhoneNumber(address.phoneNumber || '');
      return {
        fullName: address.fullName || '',
        addressLine1: address.addressLine1 || '',
        addressLine2: address.addressLine2 || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || '',
        countryCode: parsedPhone.countryCode,
        email: address.email || '',
        phoneNumber: parsedPhone.phoneNumber
      };
    },

    parsePhoneNumber(fullPhoneNumber) {
      let bestMatch = null;
      for (const country of this.countries) {
        const prefix = country.phone;
        if (fullPhoneNumber.startsWith(prefix)) {
          if (!bestMatch || prefix.length > bestMatch.phone.length) {
            bestMatch = country;
          }
        }
      }
      return {
        countryCode: bestMatch?.code || 'US',
        phoneNumber: bestMatch ? fullPhoneNumber.slice(bestMatch.phone.length) : fullPhoneNumber
      };
    },

    validate() {
      this.errors = {};
      let isValid = true;

      for (const [field, rule] of Object.entries(VALIDATION_RULES)) {
        const value = this.formData[field];
        if (rule.required && !value) {
          this.errors[field] = rule.message;
          isValid = false;
        } else if (rule.max && value.length > rule.max) {
          this.errors[field] = rule.message;
          isValid = false;
        } else if (rule.pattern && !rule.pattern.test(value)) {
          this.errors[field] = rule.message;
          isValid = false;
        }
      }

      return isValid;
    },

    submit() {
      if (!this.validate()) return;

      const selectedCountry = this.countries.find(c => c.code === this.formData.countryCode);
      const addressData = {
        ...this.formData,
        phoneNumber: selectedCountry.phone + this.formData.phoneNumber
      };
      delete addressData.countryCode;

      this.$emit('save', addressData);
    },

    cancel() {
      this.$emit('cancel');
    }
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>