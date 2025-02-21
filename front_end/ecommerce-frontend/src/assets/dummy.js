// <!-- /components/AddressSelection.vue -->
// <template>
//   <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//     <div class="max-w-5xl mx-auto">
//       <!-- Header -->
//       <h1 class="text-4xl font-bold text-gray-900 mb-10 tracking-tight">Select Delivery Address</h1>

//       <!-- Loading State -->
//       <div v-if="isLoading" class="flex justify-center items-center h-64">
//         <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
//       </div>

//       <!-- Error State -->
//       <div v-else-if="error" class="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-red-700 text-lg">
//         {{ error }}
//       </div>

//       <!-- Address Content -->
//       <div v-else class="space-y-8">
//         <!-- Address Cards -->
//         <div class="bg-white rounded-xl shadow-sm overflow-hidden">
//           <div class="p-8">
//             <div class="flex justify-between items-center mb-6">
//               <h3 class="text-2xl font-semibold text-gray-900">Saved Addresses</h3>
//               <button
//                 @click="toggleNewAddressForm"
//                 :disabled="isAddButtonDisabled"
//                 class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
//               >
//                 {{ showNewAddressForm ? 'Cancel' : 'Add New Address' }}
//               </button>
//             </div>

//             <!-- New Address Form -->
//             <div v-if="showNewAddressForm" class="mb-8">
//               <div class="bg-gray-50 rounded-lg p-6 border-2 border-blue-200">
//                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <!-- Address Details -->
//                   <div class="space-y-4">
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Full Name</label>
//                       <input
//                         v-model="newAddress.fullName"
//                         type="text"
//                         maxlength="50"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                       />
//                       <p v-if="validationErrors.fullName" class="text-red-500 text-sm mt-1">
//                         {{ validationErrors.fullName }}
//                       </p>
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Address Line 1</label>
//                       <textarea
//                         v-model="newAddress.addressLine1"
//                         maxlength="100"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         ref="autoResizeTextarea"
//                         >
//                       </textarea>
//                       <p v-if="validationErrors.addressLine1" class="text-red-500 text-sm mt-1">
//                         {{ validationErrors.addressLine1 }}
//                       </p>
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Address Line 2</label>
//                       <textarea
//                         v-model="newAddress.addressLine2"
//                         maxlength="100"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         ref="autoResizeTextarea"
//                         >
//                       </textarea>
//                       <p v-if="validationErrors.addressLine2" class="text-red-500 text-sm mt-1">
//                         {{ validationErrors.addressLine2 }}
//                       </p>
//                     </div>
//                   </div>

//                   <!-- Additional Address Details -->
//                   <div class="space-y-4">
//                     <div class="grid grid-cols-2 gap-4">
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">City</label>
//                         <input
//                           v-model="newAddress.city"
//                           type="text"
//                           maxlength="50"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <p v-if="validationErrors.city" class="text-red-500 text-sm mt-1">
//                           {{ validationErrors.city }}
//                         </p>
//                       </div>
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">State</label>
//                         <input
//                           v-model="newAddress.state"
//                           type="text"
//                           maxlength="50"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <p v-if="validationErrors.state" class="text-red-500 text-sm mt-1">
//                           {{ validationErrors.state }}
//                         </p>
//                       </div>
//                     </div>
//                     <div class="grid grid-cols-2 gap-4">
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">Postal Code</label>
//                         <input
//                           v-model="newAddress.postalCode"
//                           type="text"
//                           maxlength="10"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <p v-if="validationErrors.postalCode" class="text-red-500 text-sm mt-1">
//                           {{ validationErrors.postalCode }}
//                         </p>
//                       </div>
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">Country</label>
//                         <select
//                           v-model="newAddress.country"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         >
//                           <option v-for="country in countries" :key="country.code" :value="country.name">
//                             {{ country.name }}
//                           </option>
//                         </select>
//                       </div>
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Contact Email</label>
//                       <input
//                         v-model="newAddress.email"
//                         type="email"
//                         maxlength="100"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                       />
//                       <p v-if="validationErrors.email" class="text-red-500 text-sm mt-1">
//                         {{ validationErrors.email }}
//                       </p>
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Contact Phone</label>
//                       <div class="flex gap-2">
//                         <select
//                           v-model="newAddress.countryCode"
//                           class="min-w-[120px] pl-2 pr-8 py-2 border-2 border-gray-200 rounded-lg"
//                         >
//                           <option v-for="country in countries" :key="country.code" :value="country.code">
//                             +{{ country.phone.replace('+', '') }} ({{ country.code }})
//                           </option>
//                         </select>
//                         <input
//                           v-model="newAddress.phoneNumber"
//                           type="tel"
//                           maxlength="15"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                       <p v-if="validationErrors.phoneNumber" class="text-red-500 text-sm mt-1">
//                         {{ validationErrors.phoneNumber }}
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <!-- Form Actions -->
//                 <div class="flex justify-end mt-6 pt-4 border-t border-gray-200">
//                   <button
//                     @click="saveNewAddress"
//                     class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Save Address
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <!-- Existing Addresses -->
//             <div class="space-y-6">
//               <div
//                 v-for="address in localAddresses"
//                 :key="address.id"
//                 class="bg-gray-50 rounded-lg p-6 border-2"
//                 :class="[
//                   address.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200',
//                   selectedAddress?.id === address.id ? 'ring-2 ring-blue-500' : ''
//                 ]"
//               >
//                 <!-- Address Type Badges -->
//                 <div class="mb-4 space-y-2">
//                   <span 
//                     v-if="address.isTemporary"
//                     class="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full inline-block"
//                   >
//                     Temporary Address
//                   </span>
//                   <span
//                     v-if="address.isDefault"
//                     class="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full inline-block"
//                   >
//                     Default Address
//                   </span>
//                 </div>

//                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <!-- Address Details -->
//                   <div class="space-y-4">
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Full Name</label>
//                       <input
//                         :value="editingAddressId === address.id ? editedAddress.fullName : address.fullName"
//                         @input="e => editedAddress.fullName = e.target.value"
//                         :readonly="editingAddressId !== address.id"
//                         :class="{ 'bg-gray-100': editingAddressId !== address.id }"
//                         maxlength="50"
//                         type="text"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Address Line 1</label>
//                       <textarea
//                        :value="editingAddressId === address.id ? editedAddress.addressLine1 : address.addressLine1"
//                         @input="e => editedAddress.addressLine1 = e.target.value"
//                         :readonly="editingAddressId !== address.id"
//                         :class="{ 'bg-gray-100': editingAddressId !== address.id }"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         ref="autoResizeTextarea"
//                         >
//                       </textarea>
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Address Line 2</label>
//                       <textarea
//                        :value="editingAddressId === address.id ? editedAddress.addressLine2 : address.addressLine2"
//                         @input="e => editedAddress.addressLine2 = e.target.value"
//                         :readonly="editingAddressId !== address.id"
//                         :class="{ 'bg-gray-100': editingAddressId !== address.id }"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         ref="autoResizeTextarea"
//                         >
//                       </textarea>
//                     </div>
//                   </div>

//                   <!-- Additional Address Details -->
//                   <div class="space-y-4">
//                     <div class="grid grid-cols-2 gap-4">
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">City</label>
//                         <input
//                           :value="editingAddressId === address.id ? editedAddress.city : address.city"
//                           @input="e => editedAddress.city = e.target.value"
//                           :readonly="editingAddressId !== address.id"
//                           :class="{ 'bg-gray-100': editingAddressId !== address.id }"
//                           type="text"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">State</label>
//                         <input
//                           :value="editingAddressId === address.id ? editedAddress.state : address.state"
//                           @input="e => editedAddress.state = e.target.value"
//                           :readonly="editingAddressId !== address.id"
//                           :class="{ 'bg-gray-100': editingAddressId !== address.id }"
//                           type="text"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                     </div>
//                     <div class="grid grid-cols-2 gap-4">
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">Postal Code</label>
//                         <input
//                           :value="editingAddressId === address.id ? editedAddress.postalCode : address.postalCode"
//                           @input="e => editedAddress.postalCode = e.target.value"
//                           :readonly="editingAddressId !== address.id"
//                           :class="{ 'bg-gray-100': editingAddressId !== address.id }"
//                           type="text"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">Country</label>
//                         <input
//                           :value="editingAddressId === address.id ? editedAddress.country : address.country"
//                           @input="e => editedAddress.country = e.target.value"
//                           :readonly="editingAddressId !== address.id"
//                           :class="{ 'bg-gray-100': editingAddressId !== address.id }"
//                           type="text"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Contact Email</label>
//                       <input
//                         :value="editingAddressId === address.id ? editedAddress.email : address.email"
//                         @input="e => editedAddress.email = e.target.value"
//                         :readonly="editingAddressId !== address.id"
//                         :class="{ 'bg-gray-100': editingAddressId !== address.id }"
//                         type="email"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Contact Phone</label>
//                       <input
//                         :value="editingAddressId === address.id ? editedAddress.phoneNumber : address.phoneNumber"
//                         @input="e => editedAddress.phoneNumber = e.target.value"
//                         :readonly="editingAddressId !== address.id"
//                         :class="{ 'bg-gray-100': editingAddressId !== address.id }"
//                         type="tel"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <!-- Address Actions -->
//                 <div class="flex justify-between mt-6 pt-4 border-t border-gray-200">
//                   <div class="flex items-center space-x-6">
//                     <button
//                       v-if="editingAddressId !== address.id"
//                       @click="deleteAddress(address.id)"
//                       class="text-red-600 hover:text-red-700 transition-colors"
//                     >
//                       Delete
//                     </button>

//                     <button
//                       v-if="!address.isDefault && editingAddressId !== address.id"
//                       @click="setDefault(address.id)"
//                       class="text-blue-600 hover:text-blue-700 transition-colors"
//                     >
//                       Set as Default
//                     </button>

//                     <button
//                       v-if="editingAddressId !== address.id"
//                       @click="enterEditMode(address)"
//                       class="text-gray-600 hover:text-gray-700 transition-colors"
//                     >
//                       Edit
//                     </button>

//                     <template v-if="editingAddressId === address.id">
//                       <button
//                         @click="cancelEdit"
//                         class="text-gray-600 hover:text-gray-700 transition-colors mr-4"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         @click="updateAddress(editedAddress)"
//                         :disabled="!hasChanges()"
//                         class="text-green-600 hover:text-green-700 transition-colors disabled:opacity-50"
//                       >
//                         Save
//                       </button>
//                     </template>
//                   </div>
//                   <div class="flex space-x-4">
//                     <button
//                       @click="selectAddress(address)"
//                       class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                       :class="{ 'bg-green-600 hover:bg-green-700': selectedAddress?.id === address.id }"
//                     >
//                       {{ selectedAddress?.id === address.id ? 'Selected' : 'Select' }}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <!-- Bottom Actions -->
//         <div class="flex justify-end space-x-4">
//           <button
//             @click="$emit('cancel')"
//             class="px-6 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
//           >
//             Back to Cart
//           </button>
//           <button
//             @click="confirmSelection"
//             :disabled="!selectedAddress"
//             type="button"
//             class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
//           >
//             Use Selected Address
//           </button>
//         </div>
//       </div>
//     </div>

//     <!-- Toast Notification -->
//     <div
//       v-if="showToast"
//       class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg   transition-opacity duration-300"
//       :class="{ 'opacity-0': !showToast }"
//     >
//       {{ toastMessage }}
//     </div>
//   </div>
// </template>






// <script>
// const VALIDATION_RULES = {
//   fullName: { max: 50, message: 'Full name must be less than 50 characters' },
//   addressLine1: { max: 100, message: 'Address line 1 must be less than 100 characters' },
//   addressLine2: { max: 100, message: 'Address line 2 must be less than 100 characters' },
//   city: { max: 50, message: 'City must be less than 50 characters' },
//   state: { max: 50, message: 'State must be less than 50 characters' },
//   postalCode: { 
//     max: 10, 
//     pattern: /^[A-Z0-9\- ]+$/,
//     message: 'Postal code must be alphanumeric and less than 10 characters'
//   },
//   country: { max: 50, message: 'Country must be less than 50 characters' },
//   email: {
//     max: 100,
//     pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
//     message: 'Please enter a valid email address'
//   },
//   phoneNumber: {
//     max: 15,
//     pattern: /^\+?[0-9]{6,15}$/,
//     message: 'Phone number must be between 6-15 digits'
//   }
// };

// export default {
//   name: 'AddressSelection',
  
//   props: {
//     savedAddresses: {
//       type: Array,
//       default: () => []
//     },
//     initialSelected: {
//       type: Object,
//       default: null
//     }
//   },

//   emits: ['selected', 'cancel', 'refresh', 'update-address', 'delete-address', 'new-address', 'set-default', 'confirm'],

//   data() {
//     return {
//       countries: [
//         { name: 'United States', code: 'US', phone: '+1' },
//         { name: 'United Kingdom', code: 'GB', phone: '+44' },
//         { name: 'Canada', code: 'CA', phone: '+1' },
//         { name: 'Australia', code: 'AU', phone: '+61' },
//         { name: 'Germany', code: 'DE', phone: '+49' },
//         { name: 'France', code: 'FR', phone: '+33' },
//         { name: 'Japan', code: 'JP', phone: '+81' },
//         { name: 'India', code: 'IN', phone: '+91' },
//         { name: 'China', code: 'CN', phone: '+86' },
//         { name: 'Brazil', code: 'BR', phone: '+55' }
//       ],
//       localAddresses: [],
//       editingAddressId: null,
//       editedAddress: null,
//       originalAddresses: [],
//       selectedAddress: null,
//       showNewAddressForm: false,
//       isLoading: false,
//       error: null,
//       showToast: false,
//       toastMessage: '',
//       newAddress: this.initNewAddress(),
//       validationErrors: {}
//     }
//   },

//   computed: {
//     isAddButtonDisabled() {
//       const savedCount = this.savedAddresses.length;
//       const hasTemp = this.localAddresses.some(addr => addr.isTemporary);
//       return savedCount >= 5 && hasTemp;
//     }
//   },

//   watch: {
//     savedAddresses: {
//       immediate: true,
//       handler(newVal) {
//         const tempAddresses = JSON.parse(sessionStorage.getItem('tempAddresses') || '[]');
//         this.localAddresses = [...newVal, ...tempAddresses];
//         this.originalAddresses = JSON.parse(JSON.stringify(this.localAddresses));
//         this.selectedAddress = this.initialSelected;
//       }
//     }
//   },
//   watch: {
//   savedAddresses: {
//     immediate: true,
//     handler(newVal) {
//       const tempAddresses = JSON.parse(sessionStorage.getItem('tempAddresses') || '[]');
//       this.localAddresses = [...newVal, ...tempAddresses];
//       this.originalAddresses = JSON.parse(JSON.stringify(this.localAddresses));
//       this.selectedAddress = this.initialSelected;
//       this.$nextTick(() => {
//         this.initAutoResize();
//       });
//     }
//   }
// },

//   methods: {
//     initNewAddress() {
//       return {
//         fullName: '',
//         addressLine1: '',
//         addressLine2: '',
//         city: '',
//         state: '',
//         postalCode: '',
//         country: '',
//         countryCode: 'US',
//         email: '',
//         phoneNumber: '',
//         isDefault: false
//       };
//     },

//     validateField(field, value) {
//       const rules = VALIDATION_RULES[field];
//       if (!rules) return true;

//       if (rules.max && value.length > rules.max) {
//         return rules.message;
//       }

//       if (rules.pattern && !rules.pattern.test(value)) {
//         return rules.message;
//       }

//       return true;
//     },

//     validateAddress(address) {
//       const errors = {};
//       Object.keys(VALIDATION_RULES).forEach(field => {
//         const error = this.validateField(field, address[field]);
//         if (error !== true) {
//           errors[field] = error;
//         }
//       });
//       return Object.keys(errors).length ? errors : true;
//     },

//     showValidationError(field, message) {
//       this.showToastMessage(`${field}: ${message}`);
//     },

//     showToastMessage(message, type = 'error') {
//       this.toastMessage = message;
//       this.toastType = type;
//       this.showToast = true;
//       setTimeout(() => {
//         this.showToast = false;
//       }, 3000);
//     },

//     toggleNewAddressForm() {
//     this.showNewAddressForm = !this.showNewAddressForm;
//     if (!this.showNewAddressForm) {
//       this.newAddress = this.initNewAddress();
//     } else {
//       this.$nextTick(() => {
//         this.initAutoResize();
//       });
//     }
//   },

//     async saveNewAddress() {
//       const validation = this.validateAddress(this.newAddress);
//       if (validation !== true) {
//         this.validationErrors = validation;
//         Object.entries(validation).forEach(([field, error]) => {
//           this.showValidationError(field, error);
//         });
//         return;
//       }

//       const isTemporary = this.localAddresses.length >= 5;
//       const newAddress = { 
//         ...this.newAddress, 
//         id: `temp-${Date.now()}`,
//         isTemporary 
//       };
      
//       try {
//         await this.$emit('new-address', newAddress);
//         this.showNewAddressForm = false;
//         this.newAddress = this.initNewAddress();
//         this.showToastMessage('Address added successfully', 'success');
//       } catch (error) {
//         console.error('Error saving new address:', error);
//         this.showToastMessage('Failed to add address');
//       }
//     },

//     selectAddress(address) {
//       this.selectedAddress = address;
//       this.$emit('selected', address);
//     },

//     async setDefault(id) {
//       try {
//         await this.$emit('set-default', id);
//         this.showToastMessage('Default address updated', 'success');
//       } catch (error) {
//         console.error('Error setting default address:', error);
//         this.showToastMessage('Failed to set default address');
//       }
//     },

//     async deleteAddress(id) {
//       if (!confirm('Are you sure you want to delete this address?')) return
      
//       try {
//         await this.$emit('delete-address', id);
//         if (this.selectedAddress?.id === id) {
//           this.selectedAddress = null;
//         }
//         this.showToastMessage('Address deleted successfully', 'success');
//       } catch (error) {
//         console.error('Error deleting address:', error);
//         this.showToastMessage('Failed to delete address');
//       }
//     },

//     // enterEditMode(address) {
//     //   this.editingAddressId = address.id;
//     //   this.editedAddress = JSON.parse(JSON.stringify(address));
//     // },
//     enterEditMode(address) {
//     this.editingAddressId = address.id;
//     this.editedAddress = JSON.parse(JSON.stringify(address));
//     this.$nextTick(() => {
//       this.initAutoResize();
//     });
//   },

//     cancelEdit() {
//       this.editingAddressId = null;
//       this.editedAddress = null;
//     },

//     hasChanges() {
//       if (!this.editedAddress) return false;
//       const original = this.originalAddresses.find(a => a.id === this.editingAddressId);
//       return JSON.stringify(this.editedAddress) !== JSON.stringify(original);
//     },

//     async updateAddress(address) {
//       const validation = this.validateAddress(address);
//       if (validation !== true) {
//         this.validationErrors = validation;
//         Object.entries(validation).forEach(([field, error]) => {
//           this.showValidationError(field, error);
//         });
//         return;
//       }

//       try {
//       await this.$emit('update-address', address);
//       this.editingAddressId = null;
//       this.editedAddress = null;
//       this.$nextTick(() => {
//         this.initAutoResize();
//       });
//       this.showToastMessage('Address updated successfully', 'success');
//     } catch (error) {
//       console.error('Error updating address:', error);
//       this.showToastMessage('Failed to update address');
//     }
//     },

//     confirmSelection() {
//       if (this.selectedAddress) {
//         sessionStorage.setItem('selectedAddress', JSON.stringify(this.selectedAddress));
//         this.$emit('confirm', this.selectedAddress);
//       }
//     },
//     // initAutoResize() {
//     //   const textareas = document.querySelectorAll('textarea');
//     //   textareas.forEach(textarea => {
//     //     textarea.addEventListener('input', function() {
//     //       this.style.height = 'auto';
//     //       this.style.height = (this.scrollHeight) + 'px';
//     //     });
//     //     // Initial resize
//     //     textarea.dispatchEvent(new Event('input'));
//     //   });
//     // }
//     initAutoResize() {
//   const textareas = document.querySelectorAll('textarea');
//   textareas.forEach(textarea => {
//     const adjustHeight = () => {
//       textarea.style.height = 'auto';
//       textarea.style.height = `${textarea.scrollHeight}px`;
//     };
    
//     // Initial adjustment
//     adjustHeight();
    
//     // Adjust on input
//     textarea.addEventListener('input', adjustHeight);
    
//     // Also adjust when value is programmatically changed
//     textarea.addEventListener('change', adjustHeight);
//   });
// },
//   },

//   // mounted() {
//   //   this.selectedAddress = this.initialSelected;
//   //   sessionStorage.removeItem('selectedAddress');
//   //   this.initAutoResize();

//   // }
//   mounted() {
//   this.selectedAddress = this.initialSelected;
//   sessionStorage.removeItem('selectedAddress');
//   this.$nextTick(() => {
//     this.initAutoResize();
//   });
// }
// }
// </script>
// <!-- 
// <style>
// select {
//   appearance: none;
//   background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
//   background-repeat: no-repeat;
//   background-position: right 1rem center;
//   background-size: 1em;
// }
// </style> -->



// <!-- <style scoped>
// .form-group label {
//   margin-bottom: 0.375rem;
//   display: block;
// }

// select {
//   background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
//   background-repeat: no-repeat;
//   background-position: right 0.75rem center;
//   background-size: 1em;
//   padding-right: 2.5rem;
// }

// .address-card {
//   transition: all 0.2s ease-in-out;
// }

// .address-card:hover {
//   transform: translateY(-2px);
// }
// </style> -->
// <!-- <style scoped>
// select {
//   background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
//   background-repeat: no-repeat;
//   background-position: right 0.75rem center;
//   background-size: 1em;
//   padding-right: 2.5rem;
// }

// .address-actions button {
//   margin-right: 1.5rem;
// }
// </style> -->
// <style scoped>
// /* Proper dropdown styling */
// select {
//   appearance: none;
//   background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
//   background-repeat: no-repeat;
//   background-position: right 0.75rem center;
//   background-size: 1.2em;
//   padding-right: 2.5rem;
// }

// /* Auto-expanding textarea */
// /* textarea {
//   overflow-y: hidden;
//   min-height: 60px;
//   resize: none;
// } */
// textarea {
//   overflow-y: hidden;
//   min-height: 42px;
//   resize: none;
//   line-height: 1.5;
//   transition: height 0.1s ease;
// }

// /* Unified card styling */
// .address-card {
//   transition: all 0.2s ease-in-out;
// }

// .address-card:hover {
//   transform: translateY(-2px);
// }

// .address-actions button {
//   margin-right: 1.5rem;
// }
// </style>





















// <!-- /components/CheckoutWrapper.vue -->
// <template>
//   <div class="checkout-flow">
//     <router-view
//       :saved-addresses="addresses"
//       :selected-address="selectedAddress"
//       @address-selected="handleAddressSelected"
//       @cancel="$router.push('/cart')"
//       @refresh="loadAddresses"
//       @update-address="handleUpdateAddress"
//       @delete-address="handleDeleteAddress"
//       @new-address="handleNewAddress"
//       @set-default="handleSetDefault"
//       @confirm="handleConfirm" 
//     />
//   </div>
// </template>

// <script>
// import { onMounted, ref } from 'vue';
// import { useAuthStore } from '../stores/auth';
// import { useRouter } from 'vue-router';
// import api from '../services/api';

// export default {
//   setup() {
//     const authStore = useAuthStore();
//     const router = useRouter();
//     const addresses = ref([]);
//     const selectedAddress = ref(null);

//     const loadAddresses = async () => {
//       try {
//         const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
//         addresses.value = response.data;
//         selectedAddress.value = addresses.value.find(address => address.isDefault);
//       } catch (error) {
//         console.error('Error loading addresses:', error);
//       }
//     };

//     const handleAddressSelected = (address) => {
//       selectedAddress.value = address;
//     };


// const handleConfirm = (selectedAddress) => {
//   if (selectedAddress) {
//     // Store in sessionStorage for persistence
//     sessionStorage.setItem('selectedAddress', JSON.stringify(selectedAddress));
    
//     router.push({
//       path: '/checkout/payment',
//       state: { selectedAddress }
//     });
//   }
// };

   
//     const handleUpdateAddress = async (updatedAddress) => {
//   try {
//     // Use PUT request to update by address ID
//     await api.put(`/addresses/${updatedAddress.id}`, updatedAddress);
//     await loadAddresses(); // Refresh the address list
//   } catch (error) {
//     console.error('Error updating address:', error);
//   }
// };

//     const handleDeleteAddress = async (addressId) => {
//       try {
//         await api.delete(`/addresses/${addressId}`);
//         await loadAddresses();
//       } catch (error) {
//         console.error('Error deleting address:', error);
//       }
//     };

//     const handleNewAddress = async (newAddress) => {
//       try {
//         await api.post('/addresses/save-address', { // Use POST /save-address
//           ...newAddress,
//           userId: authStore.user.id,
//           isDefault: addresses.value.length === 0 // Set isDefault for new address only
//         });
//         await loadAddresses(); // Reload addresses to reflect changes.
//       } catch (error) {
//         console.error('Error adding new address:', error);
//       }
//     };

    
//     const handleSetDefault = async (addressId) => {
//   try {
//     const addressToUpdate = addresses.value.find(address => address.id === addressId);
//     const { id,...addressDataWithoutId } = addressToUpdate; // Remove id
//     await api.post('/addresses/save-address', {
//     ...addressDataWithoutId, // Spread without id
//       userId: authStore.user.id,
//       isDefault: true,
//     });
//     await loadAddresses();
//   } catch (error) {
//     console.error('Error setting default address:', error);
//   }
// };

//     onMounted(async () => {
//       if (authStore.isAuthenticated) {
//         await loadAddresses();
//       }
//     });

//     return {
//       addresses,
//       selectedAddress,
//       loadAddresses,
//       handleAddressSelected,
//       handleUpdateAddress,
//       handleDeleteAddress,
//       handleNewAddress,
//       handleSetDefault,
//       handleConfirm // Expose handleConfirm
//     };
//   },




// beforeRouteEnter(to, from, next) {
//   const authStore = useAuthStore();

//   authStore.checkAuth().then((isAuthenticated) => {
//     if (!isAuthenticated) {
//       next('/login?redirect=' + encodeURIComponent(to.path));
//       return;
//     }

//     // Only check addresses when specifically entering from cart
//     if (from.path === '/cart' && to.path === '/checkout/address') {
//       api.get(`/addresses/user-addresses/${authStore.user.id}`)
//         .then(response => {
//           const hasSelection = sessionStorage.getItem('selectedAddress');
//           const defaultAddress = response.data.find(a => a.isDefault);
          
//           // Only redirect if no existing selection
//           defaultAddress && !hasSelection ? next('/checkout/payment') : next();
//         })
//         .catch(() => next());
//     } else {
//       next();
//     }
//   }).catch(() => {
//     next('/login?redirect=/checkout/address');
//   });
// }

// };
// </script>

// <style scoped>
// .checkout-flow {
//   max-width: 1200px;
//   margin: 0 auto;
//   padding: 20px;
// }
// </style>




























// <template>
//   <div class="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed" 
//        style="background-image: url('/src/assets/bkgrnd.jpg')">
//     <div class="w-full max-w-md p-8 bg-white/95 backdrop-blur-sm shadow-2xl rounded-lg border border-stone-200/50">
//       <div class="mb-8 text-center">
//         <h1 class="text-3xl font-playfair text-emerald-900">Log In</h1>
//         <p class="mt-2 text-stone-600 font-light">Enter your credentials to continue</p>
//       </div>
      
//       <form @submit.prevent="login" class="space-y-6">
//         <div class="space-y-2">
//           <label for="username" class="block text-sm font-medium text-emerald-900 font-libre">Email</label>
//           <div class="relative">
//             <input 
//               type="email" 
//               id="username" 
//               v-model.trim="username" 
//               required
//               class="w-full pl-4 pr-10 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all duration-200 bg-white/50 font-libre"
//               :class="{ 'border-red-500': error }"
//             >
//             <span class="absolute right-3 top-1/2 -translate-y-1/2">
//               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400" viewBox="0 0 20 20" fill="currentColor">
//                 <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                 <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//               </svg>
//             </span>
//           </div>
//         </div>

//         <div class="space-y-2">
//           <label for="password" class="block text-sm font-medium text-emerald-900 font-libre">Password</label>
//           <div class="relative">
//             <input 
//               :type="showPassword ? 'text' : 'password'" 
//               id="password" 
//               v-model.trim="password" 
//               required
//               class="w-full pl-4 pr-10 py-3 border border-stone-200 rounded-lg focus:ring-2 focus:ring-emerald-800 focus:border-transparent outline-none transition-all duration-200 bg-white/50 font-libre"
//               :class="{ 'border-red-500': error }"
//             >
//             <button 
//               type="button"
//               @click="showPassword = !showPassword"
//               class="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
//             >
//               <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400 hover:text-emerald-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//               </svg>
//               <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-stone-400 hover:text-emerald-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         <div class="flex items-center justify-between">
//           <!-- <label class="inline-flex items-center"> -->
//             <!-- <div class="relative inline-block w-10 h-5 mr-2">
//               <input 
//                 type="checkbox" 
//                 v-model="rememberMe"
//                 class="hidden"
//               >
//               <span 
//                 class="absolute cursor-pointer inset-0 bg-stone-200 rounded-full transition-all duration-300"
//                 :class="{ 'bg-emerald-800': rememberMe }"
//               ></span>
//               <span 
//                 class="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-300 transform"
//                 :class="{ 'translate-x-5': rememberMe }"
//               ></span>
//             </div> -->
//             <!-- <span class="text-sm text-stone-600 font-libre">Remember me</span> -->
//           <!-- </label> -->
//           <a href="#" class="text-sm text-emerald-900 hover:text-emerald-800 font-medium font-libre">Forgot password?</a>
//         </div>

//         <div v-if="error" class="p-3 bg-red-50 border border-red-200 rounded-lg">
//           <p class="text-red-600 text-sm font-libre">{{ error }}</p>
//         </div>

//         <button 
//           type="submit" 
//           :disabled="isLoading"
//           class="w-full bg-emerald-900 text-white py-3 rounded-lg hover:bg-emerald-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium font-libre shadow-lg hover:shadow-xl"
//         >
//           <span v-if="isLoading" class="flex items-center justify-center">
//             <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//               <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
//               <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//             </svg>
//             Processing...
//           </span>
//           <span v-else>Log In</span>
//         </button>

//         <div class="text-center text-sm text-stone-600 font-libre">
//           <p>Need an account? 
//             <router-link 
//               to="/signup" 
//               class="text-emerald-900 hover:text-emerald-800 underline font-medium"
//             >
//               Create one
//             </router-link>
//           </p>
//         </div>
//       </form>
//     </div>
//   </div>
// </template>

// <script>
// import { useAuthStore } from '../stores/auth';

// export default {
//   name: 'LogIn',
//   data() {
//     return {
//       username: '',
//       password: '',
//       error: null,
//       isLoading: false,
//       showPassword: false,
//       rememberMe: false,
//     };
//   },
//   methods: {
//     async login() {
//       this.isLoading = true;
//       this.error = null;
//       const authStore = useAuthStore();

//       try {
//         await authStore.login({
//           username: this.username,
//           password: this.password,
//           rememberMe: this.rememberMe
//         });

//         if (authStore.isAuthenticated) {
//           const redirect = this.$route.query.redirect || '/';
//           this.$router.push(redirect);
//         }
//       } catch (error) {
//         this.error = error.response?.data?.message || 'Invalid email or password';
//       } finally {
//         this.isLoading = false;
//       }
//     }
//   },
// };
// </script>


















































































// <!-- components/UserProfile.vue -->


// <template>
//   <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//     <div class="max-w-5xl mx-auto">
//       <!-- Header -->
//       <h1 class="text-4xl font-bold text-gray-900 mb-10">My Profile</h1>

//       <!-- Loading State -->
//       <div v-if="isLoading" class="flex justify-center items-center h-64">
//         <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
//       </div>

//       <!-- Error State -->
//       <div v-else-if="error" class="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-red-700 text-lg">
//         {{ error }}
//       </div>

//       <!-- Profile Content -->
//       <div v-else class="space-y-8">
//         <!-- Profile Card -->
//         <div class="bg-white rounded-xl shadow-sm overflow-hidden">
//           <!-- Avatar and Basic Info Section -->
//           <div class="p-8 border-b border-gray-100 flex flex-col sm:flex-row items-start gap-8">
//             <!-- Avatar Section -->
            
//             <div class="relative group">
//               <div class="relative">
//                 <img
//                   :src="profilePicUrl"
//                   class="h-40 w-40 rounded-full object-cover ring-4 ring-gray-100"
//                   @error="handleImageError"
//                 />
//                 <!-- Edit Icon -->
//                 <div class="absolute bottom-0 right-0 bg-gray-300 rounded-full p-2 shadow-sm">
//                   <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
//                           d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
//                   </svg>
//                 </div>
//               </div>
              
//               <!-- Hover Overlay -->
//               <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
//                 <div class="bg-black bg-opacity-50 rounded-full h-40 w-40 flex items-center justify-center">
//                   <div class="space-y-2 text-center">
                    
//                     <button @click="fileInput?.click()" class="text-sm text-white hover:text-gray-200 transition-colors mb-2">
//                         {{ hasCustomAvatar ? 'Change Photo' : 'Add Photo' }}
//                     </button>
//                     <button 
//                       v-if="hasCustomAvatar"
//                       @click="removeAvatar"
//                       class="text-sm text-red-300 hover:text-red-200 transition-colors"
//                     >
//                       Remove
//                     </button>
//                   </div>
//                 </div>
//               </div>
              
//               <input 
//                 type="file" 
//                 ref="fileInput" 
//                 @change="handleFileSelect" 
//                 accept="image/*" 
//                 class="hidden"
//               />
//             </div>
//             <!-- Basic Info Section -->
//             <div class="flex-1 w-full">
//               <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div class="space-y-4">
//                   <div>
//                     <label class="block text-sm font-medium text-gray-500">Username</label>
//                     <input
//                       v-model="computedUsername"
//                       type="text"
//                       class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label class="block text-sm font-medium text-gray-500">Email</label>
//                     <input
//                       v-model="computedEmail"
//                       type="email"
//                       class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>
//                 </div>
//                 <div class="space-y-4">
                  
//                   <div class="flex justify-end pt-4">
//                     <button
//                       @click="saveBasicInfo"
//                       class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       Save Changes
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <!-- Add this below the Avatar and Basic Info Section -->
//           <div class="p-8 border-t border-gray-100">
//             <div class="flex justify-between items-center mb-6">
//               <h3 class="text-2xl font-semibold text-gray-900">Change Password</h3>
//             </div>

//             <form @submit.prevent="changePassword" class="space-y-6">
              
//               <div class="space-y-2">
//                 <label class="block text-sm font-medium text-gray-500">Current Password</label>
//                 <div class="relative w-1/2">
//                   <input
//                     v-model="currentPassword"
//                     :type="showCurrentPassword ? 'text' : 'password'"
//                     required
//                     class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
//                   />
//                   <button
//                     type="button"
//                     @click="showCurrentPassword = !showCurrentPassword"
//                     class=" eye-botton absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
//                   >
//                     <svg v-if="!showCurrentPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                     <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               <div class="space-y-2">
//                 <label class="block text-sm font-medium text-gray-500">New Password</label>
//                 <div class="relative w-1/2">
//                   <input
//                     v-model="newPassword"
//                     :type="showNewPassword ? 'text' : 'password'"
//                     required
//                     class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
//                   />
//                   <button
//                     type="button"
//                     @click="showNewPassword = !showNewPassword"
//                     class="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
//                   >
//                     <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                     <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//               <div class="space-y-2">
//                 <label class="block text-sm font-medium text-gray-500">Confirm New Password</label>
//                 <div class="relative w-1/2">
//                   <input
//                     v-model="confirmPassword"
//                     :type="showConfirmPassword ? 'text' : 'password'"
//                     required
//                     class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
//                   />
//                   <button
//                     type="button"
//                     @click="showConfirmPassword = !showConfirmPassword"
//                     class="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none"
//                   >
//                     <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                     </svg>
//                     <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//                     </svg>
//                   </button>
//                 </div>
//               </div>

//             </form>
//           </div>

//           <!-- Addresses Section -->
          
//           <div class="p-8">
//             <div class="flex justify-between items-center mb-6">
//               <h3 class="text-2xl font-semibold text-gray-900">Saved Addresses</h3>
//               <button
//                 @click="addNewAddress"
//                 class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Add New Address
//               </button>
//             </div>

//             <div v-if="addresses.length === 0" class="text-center py-8 text-gray-500">
//               No saved addresses. Add your first address to get started.
//             </div>

//             <div v-else class="space-y-6">
//               <div
//                 v-for="address in addresses"
//                 :key="address.id"
//                 class="bg-gray-50 rounded-lg p-6 border-2"
//                 :class="address.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200'"
//               >
//                 <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <!-- Address Details -->
//                   <div class="space-y-4">
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Full Name</label>
//                       <input
//                         v-model="address.fullName"
//                         type="text"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Address Line 1</label>
//                       <input
//                         v-model="address.addressLine1"
//                         type="text"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Address Line 2</label>
//                       <input
//                         v-model="address.addressLine2"
//                         type="text"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                   </div>

//                   <!-- Additional Address Details -->
//                   <div class="space-y-4">
//                     <div class="grid grid-cols-2 gap-4">
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">City</label>
//                         <input
//                           v-model="address.city"
//                           type="text"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">State</label>
//                         <input
//                           v-model="address.state"
//                           type="text"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                     </div>
//                     <div class="grid grid-cols-2 gap-4">
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">Postal Code</label>
//                         <input
//                           v-model="address.postalCode"
//                           type="text"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                       <div>
//                         <label class="block text-sm font-medium text-gray-500">Country</label>
//                         <input
//                           v-model="address.country"
//                           type="text"
//                           class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                         />
//                       </div>
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Contact Email</label>
//                       <input
//                         v-model="address.email"
//                         type="email"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                     <div>
//                       <label class="block text-sm font-medium text-gray-500">Contact Phone</label>
//                       <input
//                         v-model="address.phoneNumber"
//                         type="tel"
//                         class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 <!-- Address Actions -->
//                 <div class="flex justify-between mt-6 pt-4 border-t border-gray-200">
//                   <div class="flex items-center space-x-4">
//                     <button
//                       @click="deleteAddress(address.id)"
//                       class="text-red-600 hover:text-red-700 transition-colors"
//                     >
//                       Delete Address
//                     </button>
//                     <button
//                       v-if="!address.isDefault"
//                       @click="setDefaultAddress(address.id)"
//                       class="text-blue-600 hover:text-blue-700 transition-colors"
//                     >
//                       Set as Default
//                     </button>
//                     <span v-else class="text-blue-600 font-medium">Default Address</span>
//                   </div>
//                   <button
//                     @click="saveAddress(address)"
//                     class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Save Changes
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>

//     <!-- Success Toast Notification -->
//     <div
//       v-if="showToast"
//       class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300"
//       :class="{ 'opacity-0': !showToast }"
//     >
//       {{ toastMessage }}
//     </div>

//     <!-- Image Cropper Modal -->
//     <ImageCropperModal
//       v-if="showCropper"
//       :image-src="cropperImage"
//       @cancel="handleCropperCancel"
//       @save="handleCroppedImage"
//     />
//   </div>
// </template>

// <script>
// import { defineComponent, ref, onMounted } from 'vue';
// import { useAuthStore } from '../stores/auth';
// import api from '../services/api';
// import ImageCropperModal from './ImageCropperModal.vue';
// import { computed } from 'vue'; 


// export default defineComponent({
//   name: 'UserProfile',
//   components: {
//     ImageCropperModal
//   },
//   setup() {
//     const authStore = useAuthStore();
//     const profilePicUrl = ref(null);
//     const isLoading = ref(true);
//     const error = ref(null);
//     const showCropper = ref(false);
//     const cropperImage = ref(null);
//     const addresses = ref([]);
//     const username = ref(authStore.user?.username || '');
//     const email = ref(authStore.user?.email || '');
//     const phoneNumber = ref(authStore.user?.phoneNumber || '');
//     const fileInput = ref(null);
//     const showToast = ref(false);
//     const toastMessage = ref('');
//     const hasProfilePic = ref(false);
//     const currentPassword = ref('');
// const newPassword = ref('');
// const confirmPassword = ref('');
// const passwordError = ref('');
// const passwordSuccess = ref('');
// const isChangingPassword = ref(false);

// const showCurrentPassword = ref(false);
// const showNewPassword = ref(false);
// const showConfirmPassword = ref(false);




//     const hasCustomAvatar = computed(() => {
//       return authStore.user?.profilePicUrl && 
//             !authStore.user.profilePicUrl.includes('generated-avatar');
//     });

//     // Toast message handler
//     const showToastMessage = (message) => {
//       toastMessage.value = message;
//       showToast.value = true;
//       setTimeout(() => {
//         showToast.value = false;
//       }, 3000);
//     };

//     // Initialize profile data
//     onMounted(async () => {
//       try {
//         await authStore.fetchUserData();
    
//         console.log("User Data:", authStore.user); // Check the entire user object
//         console.log("Profile Pic URL:", authStore.user?.profilePicUrl); // Check specifically the URL
      
//         profilePicUrl.value = authStore.user?.profilePicUrl || '';

//         await fetchAddresses();
//       } catch (err) {
//         error.value = 'Failed to load profile data';
//         showToastMessage('Failed to load profile data');
//       } finally {
//         isLoading.value = false;
//       }
//     });

//     const computedUsername = computed({
//   get: () => authStore.user?.username || '',
//   set: (newValue) => {
//     if (authStore.user) {
//       authStore.user.username = newValue; // Or call a store action
//     }
//   }
// });

// const computedEmail = computed({
//   get: () => authStore.user?.email || '',
//   set: (newValue) => {
//     if (authStore.user) {
//       authStore.user.email = newValue; // Or call a store action
//     }
//   }
// });

// const checkProfilePic = () => {
//   hasProfilePic.value = profilePicUrl.value && !profilePicUrl.value.includes('/img/default-avatar.png');
// };


//     // Save basic profile information
 
//     const saveBasicInfo = async () => {
//       try {
//         const userData = {
//           username: authStore.user.username,
//           email: authStore.user.email,
//         };

//         await authStore.updateProfile(userData); // Use the new store action

//         showToastMessage('Profile information updated successfully');
//         await authStore.fetchUserData(); // Fetch user data again to update values in the UI
//       } catch (error) {
//         console.error('Error updating profile:', error);
//         showToastMessage(error.message || 'Failed to update profile information'); // Show error message from server
//       }
//     };

//     // Handle file selection for profile picture
//     const handleFileSelect = (event) => {
//       const file = event.target.files[0];
//       if (!file) return;

//       // Validate file
//       if (!file.type.startsWith('image/')) {
//         showToastMessage('Please upload a valid image file');
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         showToastMessage('File size must be less than 5MB');
//         return;
//       }

//       // Read file and show cropper
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         cropperImage.value = e.target.result;
//         showCropper.value = true;
//       };
//       reader.readAsDataURL(file);
//     };

//     // Handle cropped image
//     const handleCroppedImage = async (blob) => {
//       try {
//         const formData = new FormData();
//         const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
//         formData.append('image', file);

//         const response = await api.post('/profile/upload', formData, {
//           headers: { 'Content-Type': 'multipart/form-data' }
//         });

//         profilePicUrl.value = `${response.data.profilePicUrl}?t=${Date.now()}`;
//         await authStore.fetchUserData();
//         showToastMessage('Profile picture updated successfully');
//       } catch (error) {
//         console.error('Upload error:', error);
//         showToastMessage('Failed to upload profile picture');
//       } finally {
//         showCropper.value = false;
//         if (fileInput.value) {
//           fileInput.value.value = '';
//         }
//       }
//     };

//     // Handle cropper cancel
//     const handleCropperCancel = () => {
//       showCropper.value = false;
//       if (fileInput.value) {
//         fileInput.value.value = '';
//       }
//     };

//     // Remove avatar

//     const removeAvatar = async () => {
//   try {

//     await api.delete('/profile/remove');
//     await authStore.fetchUserData();
//     profilePicUrl.value = authStore.user.profilePicUrl;
//     showToastMessage('Profile picture removed successfully');
//   } catch (error) {
//     console.error('Remove error:', error);
//     showToastMessage('Failed to remove profile picture');
//   }
// };

//     // Handle image loading errors
//     const handleImageError = (e) => {
//       profilePicUrl.value = authStore.user?.profilePicUrl;
//       e.target.onerror = null;
//     };

//     // Address management functions
//     const fetchAddresses = async () => {
//       try {
//         const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
//         addresses.value = response.data;
//       } catch (err) {
//         console.error('Address fetch error:', err);
//         showToastMessage('Failed to load addresses');
//       }
//     };

//     // Set default address
//     const setDefaultAddress = async (addressId) => {
//       try {
//         const addressToUpdate = addresses.value.find(address => address.id === addressId);
//         await api.post('/addresses/save-address', {
//           userId: authStore.user.id,
//           isDefault: true,
//           id: addressId,
//           ...addressToUpdate
//         });
//         await fetchAddresses();
//         showToastMessage('Default address updated successfully');
//       } catch (error) {
//         console.error('Error setting default address:', error);
//         showToastMessage('Failed to set default address');
//       }
//     };

//     // Save address
//     const saveAddress = async (address) => {
//       try {
//         await api.post('/addresses/save-address', {
//           userId: authStore.user.id,
//           ...address
//         });
//         await fetchAddresses();
//         showToastMessage('Address updated successfully');
//       } catch (error) {
//         console.error('Error updating address:', error);
//         showToastMessage('Failed to update address');
//       }
//     };

//     // Delete address
//     const deleteAddress = async (addressId) => {
//       if (!confirm('Are you sure you want to delete this address?')) return;
      
//       try {
//         await api.delete(`/addresses/${addressId}`);
//         await fetchAddresses();
//         showToastMessage('Address deleted successfully');
//       } catch (error) {
//         console.error('Error deleting address:', error);
//         showToastMessage('Failed to delete address');
//       }
//     };

//     // Add new address
//     const addNewAddress = () => {
//       addresses.value.unshift({
//         id: `temp-${Date.now()}`, // Temporary ID
//         fullName: '',
//         addressLine1: '',
//         addressLine2: '',
//         city: '',
//         state: '',
//         postalCode: '',
//         country: '',
//         email: '',
//         phoneNumber: '',
//         isDefault: false
//       });
//     };

//     const changePassword = async () => {
//   if (newPassword.value !== confirmPassword.value) {
//     passwordError.value = 'New passwords do not match';
//     return;
//   }

//   if (newPassword.value.length < 8) {
//     passwordError.value = 'Password must be at least 8 characters';
//     return;
//   }

//   isChangingPassword.value = true;
//   passwordError.value = '';
//   passwordSuccess.value = '';

//   try {
//     await api.post('/auth/change-password', {
//       currentPassword: currentPassword.value,
//       newPassword: newPassword.value
//     });

//     passwordSuccess.value = 'Password changed successfully';
//     currentPassword.value = '';
//     newPassword.value = '';
//     confirmPassword.value = '';
//   } catch (error) {
//     passwordError.value = error.response?.data?.error || 'Failed to change password';
//   } finally {
//     isChangingPassword.value = false;
//   }
// };

//     return {
//       // UI state
//       username,
//       email,
//       phoneNumber,
//       profilePicUrl,
//       isLoading,
//       error,
//       showCropper,
//       cropperImage,
//       showToast,
//       toastMessage,
//       computedUsername,
//       computedEmail,
//       hasCustomAvatar,

//       // Refs
//       fileInput,
//       addresses,
      
//       // Methods
//       handleFileSelect,
//       handleCroppedImage,
//       handleCropperCancel,
//       handleImageError,
//       removeAvatar,
//       saveBasicInfo,
//       fetchAddresses,
//       setDefaultAddress,
//       saveAddress,
//       deleteAddress,
//       addNewAddress,
//       currentPassword,
//       newPassword,
//       confirmPassword,
//       passwordError,
//       passwordSuccess,
//       isChangingPassword,
//       changePassword,
//       showCurrentPassword,
//       showNewPassword,
//       showConfirmPassword,

//     };
//   }
// });
// </script>




// <style scoped>
// .cropper-modal {
//   position: fixed;
//   top: 0;
//   left: 0;
//   right: 0;
//   bottom: 0;
//   background: rgba(0,0,0,0.7);
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   z-index: 1000;
// }

// .cropper-content {
//   background: white;
//   border-radius: 8px;
//   width: 90%;
//   max-width: 600px;
//   padding: 20px;
// }

// .cropper-header h3 {
//   margin: 0 0 15px 0;
// }

// .cropper-body {
//   position: relative;
//   height: 400px;
// }

// .zoom-control {
//   margin-top: 15px;
//   display: flex;
//   align-items: center;
//   gap: 10px;
// }

// .zoom-control input[type="range"] {
//   flex-grow: 1;
// }

// .cropper-footer {
//   margin-top: 15px;
//   display: flex;
//   justify-content: flex-end;
//   gap: 10px;
// }

// button {
//   padding: 8px 20px;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
// }

// button:last-child {
//   background: #007bff;
//   color: white;
// }

// .profile-container {
//   max-width: 1200px;
//   margin: 2rem auto;
//   padding: 0 1rem;
// }

// .profile-content {
//   background-color: white;
//   border-radius: 8px;
//   padding: 2rem;
//   box-shadow: 0 2px 4px rgba(0,0,0,0.1);
// }

// .profile-info {
//   margin-top: 1rem;
// }

// h1 {
//   margin-bottom: 2rem;
// }

// h2 {
//   color: #333;
//   margin-bottom: 1rem;
// }

// .address-card {
//   margin: 1rem 0;
//   padding: 1rem;
//   border: 1px solid #ddd;
//   border-radius: 8px;
// }

// button {
//   background-color: #007bff;
//   color: white;
//   padding: 0.5rem 1rem;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
// }

// button:disabled {
//   background-color: #ccc;
// }

// .edit-address-form {
//   margin-top: 2rem;
//   padding: 1rem;
//   background-color: #f9f9f9;
//   border-radius: 8px;
// }

// .edit-address-form label {
//   display: block;
//   margin-bottom: 0.5rem;
// }

// .edit-address-form input {
//   width: 100%;
//   padding: 0.5rem;
//   margin-bottom: 1rem;
//   border-radius: 4px;
//   border: 1px solid #ddd;
// }

// .edit-address-form button {
//   background-color: #28a745;
// }

// .edit-address-form button[type="button"] {
//   background-color: #dc3545;
// }

// .avatar-container {
//   position: relative;
//   width: 200px;
//   margin: 20px 0;
// }

// .profile-avatar {
//   width: 200px;
//   height: 200px;
//   border-radius: 50%;
//   object-fit: cover;
//   border: 3px solid #ddd;
//   image-rendering: crisp-edges;
//   backface-visibility: hidden;
// }



// .avatar-actions {
//   margin-top: 10px;
//   display: flex;
//   gap: 10px;
// }

// input[type="file"] {
//   display: none;
// }



// .password-change-form {
//   margin-top: 2rem;
//   padding: 1.5rem;
//   background-color: #f9f9f9;
//   border-radius: 8px;
//   border: 1px solid #e5e7eb;
// }

// .password-change-form label {
//   display: block;
//   margin-bottom: 0.5rem;
//   color: #4b5563;
// }

// .password-change-form input {
//   width: 100%;
//   padding: 0.5rem;
//   margin-bottom: 1rem;
//   border: 1px solid #d1d5db;
//   border-radius: 6px;
//   transition: border-color 0.2s;
// }

// .password-change-form input:focus {
//   outline: none;
//   border-color: #3b82f6;
//   ring: 2px;
//   ring-color: #3b82f6;
// }


// .eye-botton{
//   background-color: green;
//   color: white;
// }
// </style>
