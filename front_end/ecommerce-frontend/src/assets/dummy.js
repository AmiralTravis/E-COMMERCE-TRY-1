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































































// <!-- /components/PaymentPage.vue -->
// <template>
//   <div class="payment-page">
//     <div class="order-summary">
//       <h2>Order Summary</h2>

//       <!-- Cart Items -->
//       <div class="summary-items">
//         <div v-for="item in cartStore.items" :key="item.id" class="summary-item">
//           <span>{{ item.name }} x {{ item.quantity }}</span>
//           <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
//         </div>
//       </div>

//       <!-- Totals -->
//       <div class="summary-totals">
//         <div class="summary-row">
//           <span>Subtotal</span>
//           <span>${{ cartStore.totalPrice.toFixed(2) }}</span>
//         </div>
//         <div class="summary-row">
//           <span>Shipping</span>
//           <span>${{ shipping.toFixed(2) }}</span>
//         </div>
//         <div class="summary-row">
//           <span>Tax</span>
//           <span>${{ tax.toFixed(2) }}</span>
//         </div>
//         <div class="summary-row total">
//           <span>Total</span>
//           <span>${{ total.toFixed(2) }}</span>
//         </div>
//       </div>

//       <!-- Shipping Details -->
//       <div v-if="selectedAddress" class="shipping-details">
//         <h3>Shipping Information</h3>
//         <div class="shipping-info">
//           <p v-if="selectedAddress.fullName"><strong>Name:</strong> {{ selectedAddress.fullName }}</p>
//           <p v-if="selectedAddress.email"><strong>Email:</strong> {{ selectedAddress.email }}</p>
//           <p v-if="selectedAddress.phoneNumber"><strong>Phone:</strong> {{ selectedAddress.phoneNumber }}</p>
//           <p v-if="selectedAddress.addressLine1">
//             <strong>Address:</strong> {{ selectedAddress.addressLine1 }}
//             {{ selectedAddress.addressLine2 ? ', ' + selectedAddress.addressLine2 : '' }}
//           </p>
//           <p v-if="selectedAddress.city || selectedAddress.state || selectedAddress.postalCode">
//             {{ selectedAddress.city }},
//             {{ selectedAddress.state }}
//             {{ selectedAddress.postalCode }}
//           </p>
//           <p v-if="selectedAddress.country"><strong>Country:</strong> {{ selectedAddress.country }}</p>
//         </div>
//         <button @click="changeAddress" class="change-address-btn">Change Address</button>
//       </div>

//       <!-- PayPal Button -->
//       <div id="paypal-button-container"></div>
//     </div>
//   </div>
// </template>

// <script setup>
// import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
// import { useRouter } from 'vue-router';
// import { useCartStore } from '../stores/cart';
// import { useAuthStore } from '../stores/auth';
// import api from '../services/api';

// const cartStore = useCartStore();
// const authStore = useAuthStore();
// const router = useRouter();

// const shippingDetails = ref(null);
// const addresses = ref([]);
// const selectedAddress = ref(null);
// const loadedFromStorage = ref(false);


// // Use cart store getters for shipping, tax, and total
// const shipping = computed(() => cartStore.shipping);
// const tax = computed(() => cartStore.tax);
// const total = computed(() => cartStore.total);

// // Fetch addresses and set the default selected address
// // const fetchAddresses = async () => {
// //   try {
// //     const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
// //     addresses.value = response.data;
// //     selectedAddress.value = addresses.value.find(address => address.isDefault);
// //   } catch (error) {
// //     console.error('Error fetching addresses:', error);
// //   }
// // };
// const fetchAddresses = async () => {
//   if (loadedFromStorage.value) return;
  
//   try {
//     const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
//     addresses.value = response.data;
//   } catch (error) {
//     console.error('Error fetching addresses:', error);
//   }
// };

// // Navigate back to the address selection page
// const changeAddress = () => {
//   router.push('/checkout/address');
// };

// // Create the order in the backend before PayPal starts
// const handleSubmit = async () => {
//   try {
//     if (cartStore.items.length === 0) {
//       throw new Error('Cannot submit order with an empty cart');
//     }

//     const response = await api.post('/orders', {
//       items: cartStore.items.map(item => ({
//         productId: item.productId,
//         quantity: item.quantity,
//         price: item.price
//       })),
//       totalAmount: cartStore.total, // Use the total including shipping and tax
//       shippingDetails: shippingDetails.value
//     });

//     return response.data.id; // Return the order ID
//   } catch (error) {
//     console.error('Error creating order:', error);
//     return null;
//   }
// };

// // Load PayPal button and set up payment flow
// const loadPayPalButton = () => {
//   window.paypal.Buttons({
//     createOrder: async (data, actions) => {
//       const orderId = await handleSubmit(); // Create order in backend
//       if (!orderId) {
//         alert('Failed to create order. Please try again.');
//         return;
//       }
//       // Pass the order ID to PayPal for payment processing
//       return actions.order.create({
//         purchase_units: [{
//           amount: { 
//             currency_code: 'USD', // Add currency_code here
//             value: total.value.toFixed(2), // Include shipping and tax
//             breakdown: {
//               item_total: { 
//                 currency_code: 'USD', // Add currency_code here
//                 value: cartStore.totalPrice.toFixed(2) // Subtotal
//               },
//               shipping: { 
//                 currency_code: 'USD', // Add currency_code here
//                 value: shipping.value.toFixed(2) // Shipping
//               },
//               tax_total: { 
//                 currency_code: 'USD', // Add currency_code here
//                 value: tax.value.toFixed(2) // Tax
//               }
//             }
//           }
//         }]
//       });
//     },

//     onApprove: async (data, actions) => {
//       try {
//         // First capture the payment
//         await actions.order.capture();
        
//         // Then verify with your backend
//         await api.post('/paypal/verify-order', {
//           orderId: data.orderID,
//           totalAmount: parseFloat(total.value.toFixed(2)) // Use the total including shipping and tax
//         });

//         // Try to clear the cart
//         await cartStore.clearCart();

//         // Navigate to success page
//         router.push('/order-success');
//       } catch (error) {
//         console.error('Payment Error:', error);
//         alert('Payment failed. Please try again.');
//       }
//     },

//     onError: (err) => {
//       console.error('PayPal Checkout Error:', err);
//       alert('There was an error with PayPal checkout. Please try again.');
//     }
//   }).render('#paypal-button-container');
// };






// // Keep selected address in sessionStorage until explicitly cleared
// onMounted(() => {
//   const routeState = router.currentRoute.value.state;
//   const storedAddress = sessionStorage.getItem('selectedAddress');

//   if (routeState?.selectedAddress) {
//     sessionStorage.setItem('selectedAddress', JSON.stringify(routeState.selectedAddress));
//     selectedAddress.value = routeState.selectedAddress;
//   } else if (storedAddress) {
//     selectedAddress.value = JSON.parse(storedAddress);
//   } else {
//     fetchAddresses().then(() => {
//       selectedAddress.value = addresses.value.find(a => a.isDefault);
//     });
//   }
// });

// // Clear storage when leaving payment page
// onBeforeUnmount(() => {
//   if (!router.currentRoute.value.path.includes('/checkout/payment')) {
//     sessionStorage.removeItem('selectedAddress');
//   }
// });

// onMounted(async () => {
//   await cartStore.fetchCart();
//   // await fetchAddresses();

//   const paypalScript = document.createElement('script');
//   paypalScript.src = "https://www.paypal.com/sdk/js?client-id=AceJUHWaafcPScT9WEkm0eDlocn_7QBvYEH2xHX0dOIcqCIopSWz9WaQYzglzSuD0XNmtLQ5sAXkuC9c";
//   paypalScript.onload = loadPayPalButton;
//   document.body.appendChild(paypalScript);
// });
// </script>

// <style scoped>
// .payment-page {
//   max-width: 800px;
//   margin: 0 auto;
//   padding: 2rem;
//   display: flex;
//   gap: 2rem;
//   background-color: #f8f9fa;
// }

// .order-summary {
//   background-color: white;
//   border-radius: 12px;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   padding: 1.5rem;
//   width: 100%;
//   transition: all 0.3s ease;
// }

// .summary-items {
//   border-bottom: 1px solid #e9ecef;
//   padding-bottom: 1rem;
//   margin-bottom: 1rem;
// }

// .summary-item {
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 0.5rem;
//   color: #495057;
// }

// .summary-totals {
//   margin-bottom: 1.5rem;
// }

// .summary-row {
//   display: flex;
//   justify-content: space-between;
//   margin-bottom: 0.5rem;
//   color: #343a40;
// }

// .summary-row.total {
//   font-weight: bold;
//   color: #212529;
//   border-top: 2px solid #dee2e6;
//   padding-top: 0.5rem;
// }

// #paypal-button-container {
//   width: 100%;
//   display: flex;
//   justify-content: center;
//   margin-top: 1rem;
// }

// h2 {
//   color: #343a40;
//   margin-bottom: 1rem;
//   border-bottom: 2px solid #007bff;
//   padding-bottom: 0.5rem;
// }

// .change-address-btn {
//   margin-top: 1rem;
//   padding: 0.5rem 1rem;
//   background-color: #007bff;
//   color: white;
//   border: none;
//   border-radius: 4px;
//   cursor: pointer;
// }

// @media (max-width: 768px) {
//   .payment-page {
//     flex-direction: column;
//     padding: 1rem;
//     gap: 1rem;
//   }
// }
// </style>


















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























// // // tailwind.config/js
// /** @type {import('tailwindcss').Config} */



// module.exports = {
//     content: [
//       "./index.html",
//       "./src/**/*.{vue,js,ts,jsx,tsx}",
//     ],
//     theme: {
//       extend: {
//         // colors: {
//         //   primary: '#3498db',
//         //   'primary-dark': '#2980b9'
//         // }
//       },
//     },
//     plugins: [],
//   }



























// <!-- /components/ProductImageManagamenet.vue -->

// <template>
//   <section class="panel mt-6 main-panel">
//     <h2 class="section-title text-lg font-semibold mb-4 pb-2 border-b border-gray-200">Product Images</h2>
//     <div class="image-management-container">
//       <!-- Main Display Image with Upload -->
//       <div class="main-image-container group" @click="triggerMainImageUpload">
//         <div class="product-image-container">
//           <div v-if="mainImage" class="product-image-preview">
//             <img
//               :src="mainImage.url"
//               alt="Main product image"
//               class="product-image"
//             />
//             <button 
//               @click.stop="removeMainImage"
//               class="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-red-50"
//             >
//               <TrashIcon class="w-4 h-4 text-red-500" />
//             </button>
//             <button
//               @click.stop="triggerMainImageUpload"
//               class="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-sm shadow-sm hover:bg-gray-100"
//             >
//               Change Image
//             </button>
//           </div>
//           <div v-else class="upload-prompt">
//             <div class="flex flex-col items-center justify-center w-full h-full">
//               <PlusCircleIcon class="w-12 h-12 text-gray-400 mb-2" />
//               <p class="text-gray-500 text-sm">Upload Main Image</p>
//             </div>
//           </div>
//           <input 
//             ref="mainImageInput"
//             type="file"
//             accept="image/*"
//             class="hidden"
//             @change="handleMainImageUpload"
//           />
//         </div>
//       </div>

//       <!-- Thumbnails and Upload Section -->
//       <div class="thumbnails-section">
//         <div class="thumbnails-container" ref="thumbnailsContainer">
//           <!-- Map each image to a thumbnail -->
//           <div 
//             v-for="(image, index) in productImages" 
//             :key="image.id"
//             class="thumbnail-container"
//             data-type="image"
//           >
//             <img 
//               :src="image.url" 
//               alt="Product thumbnail" 
//               class="w-full h-full object-cover"
//               @click="openLightbox(index)"
//             />
//             <button 
//               @click.stop="removeImage(index)" 
//               class="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow-sm hover:bg-red-50"
//             >
//               <TrashIcon class="w-4 h-4 text-red-500" />
//             </button>
//           </div>

//           <!-- Add Thumbnail Button -->
//           <div 
//             v-if="productImages.length < 20" 
//             class="add-image-container"
//             data-type="add-button"
//             @click="triggerFileUpload"
//           >
//             <input 
//               ref="fileInput"
//               type="file"
//               accept="image/*"
//               multiple
//               class="hidden"
//               @change="handleFileUpload"
//             />
//             <PlusCircleIcon class="w-8 h-8 text-gray-400" />
//           </div>
//         </div>
//       </div>
//     </div>

//     <!-- Lightbox -->
//     <div v-if="lightboxVisible" class="lightbox" @click="closeLightbox">
//       <div class="lightbox-content">
//         <div 
//           class="zoom-container"
//           :class="{'cursor-zoom-in': !zoomActive, 'cursor-zoom-out': zoomActive}"
//           @click.stop="toggleZoomActive"
//           @mousemove="handleZoom"
//           @mouseleave="isZoomed = false"
//           :title="zoomActive ? 'Click to disable zoom' : 'Click to enable hover-zoom'"
//         >
//           <div v-if="!zoomActive" class="zoom-hint">Click to zoom</div>
//           <img 
//             :src="productImages[lightboxIndex]?.url" 
//             alt="Product image"
//             class="lightbox-image"
//             ref="lightboxImage"
//             :style="zoomStyle"
//           />
//         </div>
//         <button 
//           class="lightbox-close"
//           @click.stop="closeLightbox"
//         >×</button>
//         <button 
//           class="lightbox-nav prev"
//           @click.stop="prevImage"
//         >&#10094;</button>
//         <button 
//           class="lightbox-nav next"
//           @click.stop="nextImage"
//         >&#10095;</button>
//       </div>
//     </div>

//     <!-- Help Text -->
//     <div class="mt-3 text-sm text-gray-500 flex justify-between items-center">
//       <span>Drag to reorder. Maximum 20 images allowed. <br>Note: Images will be displayed in the order arranged in here. </span>
//       <span>{{ productImages?.length || 0 }}/20 images</span>

//     </div>
//   </section>
// </template>

// <script setup>
// import { ref, computed, onMounted } from 'vue';
// import { TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline';
// import Sortable from 'sortablejs';
// import { toast } from 'vue3-toastify';
// import api from '@/services/api';
// import { useRoute } from 'vue-router';

// const route = useRoute();

// // Props to receive and emit product images
// const props = defineProps({
//   modelValue: {
//     type: Array,
//     default: () => []
//   }
// });

// const emit = defineEmits(['update:modelValue']);

// // Image states
// const mainImage = ref(null);


// const productImages = computed({
//   get: () => Array.isArray(props.modelValue) ? props.modelValue : [], // Ensure it's always an array
//   set: (val) => emit('update:modelValue', val)
// });

// // Lightbox state
// const lightboxVisible = ref(false);
// const lightboxIndex = ref(0);
// const lightboxImage = ref(null);

// const isZoomed = ref(false);
// const zoomActive = ref(false); // Toggleable zoom state
// const zoomPosition = ref({ x: 0, y: 0 });

// // Refs
// const mainImageInput = ref(null);
// const fileInput = ref(null);
// const thumbnailsContainer = ref(null);

// const totalImages = computed(() => 
//   (mainImage.value ? 1 : 0) + (productImages.value?.length || 0)
// );

// // Load product images on mount
// // const loadProductImages = async () => {
// //   try {
// //     const response = await api.get(`/admin/products/${route.params.id}`);
// //     // Ensure images array exists
// //     productImages.value = response.data.images || response.data.productImages || [];
// //     mainImage.value = response.data.mainImage || null;
// //   } catch (error) {
// //     console.error('Error loading product images:', error);
// //     toast.error('Failed to load product images');
// //   }
// // };
// const loadProductImages = async () => {
//   try {
//     // Skip if no product ID (e.g., on the Add Product page)
//     if (!route.params.id) {
//       productImages.value = [];
//       mainImage.value = null;
//       return;
//     }

//     const response = await api.get(`/admin/products/${route.params.id}`);
//     // Ensure images array exists
//     productImages.value = response.data.images || response.data.productImages || [];
//     mainImage.value = response.data.mainImage || null;
//   } catch (error) {
//     console.error('Error loading product images:', error);
//     toast.error('Failed to load product images');
//   }
// };

// onMounted(async () => {
//   await loadProductImages();
// });

// // Main image handling
// const triggerMainImageUpload = () => {
//   mainImageInput.value.click();
// };

// const handleMainImageUpload = async (event) => {
//   const file = event.target.files[0];
//   if (!file) return;

//   // Client-side validation
//   if (!file.type.startsWith('image/')) {
//     toast.error('Please upload an image file');
//     return;
//   }
//   if (file.size > 5 * 1024 * 1024) {
//     toast.error('Image size must be less than 5MB');
//     return;
//   }

//   try {
//     const formData = new FormData();
//     formData.append('image', file);
    
//     const response = await api.put(
//       `/admin/products/${route.params.id}/main-image`, 
//       formData,
//       { headers: { 'Content-Type': 'multipart/form-data' }
//   });
    
//     // Update to match new structure
//     mainImage.value = { url: response.data.imageUrl };
//     toast.success('Main image updated');
//   } catch (error) {
//     toast.error('Failed to upload main image');
//   }
// };

// // Thumbnail handling
// const triggerFileUpload = () => {
//   if (productImages.value.length >= 20) {
//     toast.error('Maximum 20 thumbnails allowed');
//     return;
//   }
//   fileInput.value.click();
// };

// // const handleFileUpload = async (event) => {
// //   const files = event.target.files;
// //   if (!files || files.length === 0) {
// //     toast.error('No files selected');
// //     return;
// //   }

// //   // Check remaining slots
// //   const remainingSlots = 20 - (productImages.value?.length || 0);
// //   if (files.length > remainingSlots) {
// //     toast.error(`You can only upload ${remainingSlots} more thumbnails`);
// //     return;
// //   }

// //   // Validate file sizes
// //   let valid = true;
// //   Array.from(files).forEach(file => {
// //     if (file.size > 5 * 1024 * 1024) {
// //       toast.error(`${file.name} exceeds 5MB size limit`);
// //       valid = false;
// //     }
// //   });

// //   if (!valid) return;

// //   try {
// //     const formData = new FormData();
// //     Array.from(files).forEach(file => {
// //       formData.append('thumbnails', file);
// //     });

// //     const response = await api.post(
// //       `/admin/products/${route.params.id}/thumbnails`,
// //       formData,
// //       {
// //         headers: { 'Content-Type': 'multipart/form-data' },
// //         onUploadProgress: (progressEvent) => {
// //           const percentCompleted = Math.round(
// //             (progressEvent.loaded * 100) / progressEvent.total
// //           );
// //           console.log(`Upload progress: ${percentCompleted}%`);
// //         }
// //       }
// //     );

// //     productImages.value = [
// //       ...(productImages.value || []),
// //       ...response.data.map(img => ({ id: img.id, url: img.url }))
// //     ];

// //     toast.success('Thumbnails added successfully');
// //   } catch (error) {
// //     console.error('Upload error:', {
// //       message: error.message,
// //       response: error.response?.data,
// //       stack: error.stack
// //     });

// //     const errorMessage = error.response?.data?.error || 
// //                         error.response?.data?.message || 
// //                         'Failed to upload thumbnails';
// //     toast.error(errorMessage);
// //   } finally {
// //     event.target.value = '';
// //   }
// // };

// // Lightbox functionality
// const handleFileUpload = async (event) => {
//   const files = event.target.files;
//   if (!files || files.length === 0) {
//     toast.error('No files selected');
//     return;
//   }

//   // Check remaining slots
//   const remainingSlots = 20 - (productImages.value?.length || 0);
//   if (files.length > remainingSlots) {
//     toast.error(`You can only upload ${remainingSlots} more thumbnails`);
//     return;
//   }

//   // Validate file sizes
//   let valid = true;
//   Array.from(files).forEach(file => {
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error(`${file.name} exceeds 5MB size limit`);
//       valid = false;
//     }
//   });

//   if (!valid) return;

//   try {
//     const formData = new FormData();
//     Array.from(files).forEach(file => {
//       formData.append('thumbnails', file);
//     });

//     // If no product ID (new product), skip upload and store files locally
//     if (!route.params.id) {
//       const localImages = Array.from(files).map(file => ({
//         id: null, // No ID yet
//         url: URL.createObjectURL(file), // Create a local URL for preview
//         file // Store the file for later upload
//       }));
//       productImages.value = [...productImages.value, ...localImages];
//       return;
//     }

//     // If product ID exists, upload images to the server
//     const response = await api.post(
//       `/admin/products/${route.params.id}/thumbnails`,
//       formData,
//       {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         onUploadProgress: (progressEvent) => {
//           const percentCompleted = Math.round(
//             (progressEvent.loaded * 100) / progressEvent.total
//           );
//           console.log(`Upload progress: ${percentCompleted}%`);
//         }
//       }
//     );

//     productImages.value = [
//       ...(productImages.value || []),
//       ...response.data.map(img => ({ id: img.id, url: img.url }))
//     ];

//     toast.success('Thumbnails added successfully');
//   } catch (error) {
//     console.error('Upload error:', {
//       message: error.message,
//       response: error.response?.data,
//       stack: error.stack
//     });

//     const errorMessage = error.response?.data?.error || 
//                         error.response?.data?.message || 
//                         'Failed to upload thumbnails';
//     toast.error(errorMessage);
//   } finally {
//     event.target.value = '';
//   }
// };

// const toggleZoomActive = () => {
//   zoomActive.value = !zoomActive.value;
//   if (!zoomActive.value) {
//     isZoomed.value = false;
//   }
// };

// const handleZoom = (event) => {
//   if (!zoomActive.value || !lightboxImage.value) return;
  
//   const rect = lightboxImage.value.getBoundingClientRect();
//   const x = ((event.clientX - rect.left) / rect.width) * 100;
//   const y = ((event.clientY - rect.top) / rect.height) * 100;
  
//   zoomPosition.value = { x, y };
//   isZoomed.value = true;
// };

// const zoomStyle = computed(() => {
//   if (!isZoomed.value || !zoomActive.value) return {};
//   return {
//     transform: 'scale(2)',
//     transformOrigin: `${zoomPosition.value.x}% ${zoomPosition.value.y}%`
//   };
// });

// // Lightbox navigation
// const prevImage = () => {
//   lightboxIndex.value = lightboxIndex.value > 0 
//     ? lightboxIndex.value - 1 
//     : (productImages.value?.length || 0) - 1;
//   resetZoomState();
// };

// const nextImage = () => {
//   lightboxIndex.value = lightboxIndex.value < (productImages.value?.length || 0) - 1 
//     ? lightboxIndex.value + 1 
//     : 0;
//   resetZoomState();
// };

// const resetZoomState = () => {
//   zoomActive.value = false;
//   isZoomed.value = false;
// };

// // Open lightbox
// const openLightbox = (index) => {
//   lightboxIndex.value = index;
//   lightboxVisible.value = true;
//   resetZoomState();
// };

// // Close lightbox
// const closeLightbox = () => {
//   lightboxVisible.value = false;
//   resetZoomState();
// };

// // Remove an image
// const removeImage = async (index) => {
//   const image = productImages.value?.[index];
//   if (!image?.id) {
//     productImages.value.splice(index, 1);
//     return;
//   }

//   try {
//     await api.delete(`/admin/products/${route.params.id}/images/${image.id}`);
//     productImages.value.splice(index, 1);
//     toast.success('Image removed');
//   } catch (error) {
//     toast.error('Failed to remove image');
//   }
// };

// // Remove main image
// const removeMainImage = () => {
//   mainImage.value = null;
// };

// // Initialize Sortable.js for drag and drop
// onMounted(() => {
//   if (thumbnailsContainer.value && productImages.value) {
//     Sortable.create(thumbnailsContainer.value, {
//       animation: 150,
//       filter: '[data-type="add-button"]', // Prevent dragging the add button
//       preventOnFilter: false,
//       onMove: function(evt) {
//         const targetNode = evt.related;
//         if (targetNode && targetNode.getAttribute('data-type') === 'add-button') {
//           return false; // Prevent dragging over the add button
//         }
//       },
//       onEnd: (evt) => {
//         if (evt.oldIndex === evt.newIndex) return; // No change

//         const newImages = [...productImages.value];
//         const [movedItem] = newImages.splice(evt.oldIndex, 1);
//         newImages.splice(evt.newIndex, 0, movedItem);

//         // Emit new order immediately
//         productImages.value = newImages;
//       }
//     });
//   }
// });
// </script>

// <style scoped>
// .main-panel {
//   min-height: 400px;
// }

// .image-management-container {
//   display: flex;
//   flex-direction: row;
//   gap: 1rem;
//   align-items: flex-start;
// }

// .main-image-container {
//   position: relative;
//   width: 300px;
//   height: 300px;
//   background-color: #f3f4f6;
//   border-radius: 0.5rem;
//   overflow: hidden;
//   border: 2px dashed #e5e7eb;
//   cursor: pointer;
//   transition: border-color 0.3s;
// }

// .main-image-container:hover {
//   border-color: #3b82f6;
// }

// .product-image-container {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: relative;
// }

// .product-image-preview {
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   position: relative;
// }

// .product-image {
//   max-width: 100%;
//   max-height: 100%;
//   object-fit: contain;
// }

// .upload-prompt {
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   width: 100%;
//   height: 100%;
//   text-align: center;
// }

// .thumbnails-section {
//   width: calc(100% - 300px - 1rem);
// }

// .thumbnails-container {
//   display: grid;
//   grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
//   gap: 0.5rem;
// }

// .thumbnail-container {
//   position: relative;
//   width: 100%;
//   height: 100px;
//   background-color: #f3f4f6;
//   border-radius: 0.5rem;
//   overflow: hidden;
//   border: 1px solid #e5e7eb;
//   cursor: pointer;
// }

// .add-image-container {
//   width: 100%;
//   height: 100px;
//   background-color: #f9fafb;
//   border-radius: 0.5rem;
//   border: 1px dashed #d1d5db;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;
// }

// .lightbox {
//   position: fixed;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   background-color: rgba(0, 0, 0, 0.8);
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   z-index: 1000;
// }

// .lightbox-content {
//   position: relative;
//   width: 80vw;
//   height: 80vh;
//   max-width: 1200px;
// }

// .zoom-container {
//   width: 100%;
//   height: 100%;
//   overflow: hidden;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   transition: cursor 0.2s;
// }

// .lightbox-image {
//   max-width: 100%;
//   max-height: 100%;
//   object-fit: contain;
//   transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
// }

// .cursor-zoom-in {
//   cursor: zoom-in;
// }

// .cursor-zoom-out {
//   cursor: zoom-out;
// }

// .lightbox-close {
//   position: absolute;
//   top: 20px;
//   right: 20px;
//   background: rgba(0, 0, 0, 0.7);
//   color: white;
//   border: none;
//   border-radius: 50%;
//   width: 40px;
//   height: 40px;
//   font-size: 24px;
//   cursor: pointer;
//   z-index: 1001;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   transition: all 0.3s ease;
// }

// .lightbox-nav {
//   position: absolute;
//   top: 50%;
//   transform: translateY(-50%);
//   background-color: rgba(0, 0, 0, 0.7);
//   color: white;
//   border: none;
//   padding: 15px;
//   cursor: pointer;
//   z-index: 1001;
//   font-size: 24px;
//   line-height: 1;
//   transition: all 0.3s ease;
// }

// .lightbox-nav.prev {
//   left: 20px;
// }

// .lightbox-nav.next {
//   right: 20px;
// }

// @media (max-width: 768px) {
//   .image-management-container {
//     flex-direction: column;
//   }
  
//   .thumbnails-section {
//     width: 100%;
//     margin-top: 1rem;
//   }
  
//   .main-image-container {
//     width: 100%;
//     height: 300px;
//   }
// }
// </style>
















//  <template>
//     <div class="product-edit-container">
//       <h1 class="text-2xl font-bold my-6 pt-2">Edit Product</h1>
  
//       <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <!-- Left Column: Product Details -->
//         <div class="lg:col-span-2 space-y-6">
//           <!-- Image Display Section -->
//           <!-- <section class="panel">
//             <h2 class="section-title">Product Images</h2>
//             <div class="grid grid-cols-1 md:grid-cols-2 gap-6"> -->
//               <!-- Main Image Display -->
//               <!-- <div class="main-image-container">
//                 <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-colors">
//                   <img 
//                     :src="mainImage" 
//                     class="w-full h-full object-contain cursor-zoom-in"
//                     @mouseover="zoomImage"
//                     @mouseout="resetZoom"
//                   >
//                 </div>
//               </div> -->
  
//               <!-- Thumbnail Grid -->
//               <!-- <div class="thumbnail-grid">
//                 <draggable 
//                   v-model="product.images" 
//                   group="images" 
//                   item-key="id"
//                   class="grid grid-cols-3 gap-3"
//                 >
//                   <template #item="{ element, index }">
//                     <div class="thumbnail-container group relative">
//                       <img 
//                         :src="element" 
//                         class="aspect-square object-cover rounded-lg border-2 cursor-pointer"
//                         :class="index === 0 ? 'border-blue-500' : 'border-gray-200'"
//                         @click="setMainImage(index)"
//                       >
//                       <button 
//                         @click="removeImage(index)"
//                         class="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
//                       >
//                         <TrashIcon class="w-4 h-4 text-red-500" />
//                       </button>
//                     </div>
//                   </template>
//                 </draggable> -->
                
//                 <!-- Upload Box -->
//                 <!-- <div 
//                   class="upload-box aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
//                   @click="triggerFileInput"
//                 >
//                   <div class="text-center">
//                     <PlusCircleIcon class="w-8 h-8 text-gray-400 mx-auto" />
//                     <p class="text-sm text-gray-500 mt-2">Upload Images</p>
//                   </div>
//                   <input 
//                     ref="fileInput"
//                     type="file" 
//                     multiple 
//                     accept="image/*" 
//                     class="hidden" 
//                     @change="handleImageUpload"
//                   >
//                 </div>
//               </div>
//             </div>
//           </section> -->
  
//           <!-- Pricing Section -->
//           <!-- <section class="panel">
//             <h2 class="section-title">Pricing & Discount</h2>
//             <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div class="form-group">
//                 <label>Original Price</label>
//                 <input
//                   v-model.number="originalPrice"
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   class="form-input"
//                   placeholder="0.00"
//                 >
//               </div>
  
//               <div class="form-group">
//                 <label>Discount Percentage</label>
//                 <input
//                   v-model.number="currentDiscount"
//                   type="number"
//                   step="1"
//                   min="0"
//                   max="75"
//                   class="form-input"
//                   placeholder="0"
//                 >
//               </div>
  
//               <div class="form-group">
//                 <label>Selling Price</label>
//                 <input
//                   :value="sellingPrice.toFixed(2)"
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   class="form-input"
//                   @input="updateSellingPrice($event.target.value)"
//                   placeholder="0.00"
//                 >
//               </div>
//             </div>
//           </section> -->
//           <section class="panel">
//           <h2 class="section-title">Pricing & Discount</h2>
//           <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div class="form-group">
//               <label>Selling Price</label>
//               <input
//                 :value="sellingPrice.toFixed(2)"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 class="form-input"
//                 @input="updateSellingPrice($event.target.value)"
//                 placeholder="0.00"
//               />
//             </div>

//             <div class="form-group">
//               <label>Original Price</label>
//               <input
//                 v-model.number="originalPrice"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 class="form-input"
//                 placeholder="0.00"
//               />
//             </div>

//             <div class="form-group">
//               <label>Cost Price</label>
//               <input
//                 v-model.number="product.costPrice"
//                 type="number"
//                 step="0.01"
//                 min="0"
//                 class="form-input"
//                 placeholder="0.00"
//               />
//             </div>

//             <div class="form-group">
//               <label>Discount Percentage</label>
//               <input
//                 v-model.number="currentDiscount"
//                 type="number"
//                 step="1"
//                 min="0"
//                 max="75"
//                 class="form-input"
//                 placeholder="0"
//               />
//             </div>

//             <div class="form-group">
//               <label>Start Date</label>
//               <input type="date" class="form-input" />
//             </div>

//             <div class="form-group">
//               <label>End Date</label>
//               <input type="date" class="form-input" />
//             </div>
//           </div>
//         </section>
//           <!-- Product Details -->
//           <section class="panel">
//             <h2 class="section-title">Product Details</h2>
//             <div class="space-y-4">
//               <div class="form-group">
//                 <label>Product Name</label>
//                 <input 
//                   v-model="product.name" 
//                   class="form-input" 
//                   placeholder="Enter product name"
//                 >
//               </div>
  
//               <div class="form-group">
//                 <label>Description</label>
//                 <textarea 
//                   v-model="product.description" 
//                   rows="4" 
//                   class="form-input" 
//                   placeholder="Enter product description"
//                 ></textarea>
//               </div>
  
//               <div class="grid grid-cols-2 gap-4">
//                 <div class="form-group">
//                   <label>SKU</label>
//                   <input 
//                     v-model="product.sku" 
//                     class="form-input" 
//                     placeholder="Enter SKU"
//                   >
//                 </div>
  
//                 <div class="form-group">
//                   <label>Stock Quantity</label>
//                   <input 
//                     v-model.number="product.stock" 
//                     type="number" 
//                     class="form-input" 
//                     placeholder="Enter stock"
//                   >
//                 </div>
//               </div>
//             </div>
//           </section>
  
//           <!-- Inventory Management -->
//           <section class="panel">
//             <h2 class="section-title">Inventory Management</h2>
//             <div class="space-y-4">
//               <div class="flex items-center gap-2">
//                 <input 
//                   v-model="product.trackInventory" 
//                   type="checkbox" 
//                   id="trackInventory"
//                   class="w-4 h-4"
//                 >
//                 <label for="trackInventory">Track inventory for this product</label>
//               </div>
  
//               <div class="flex items-center gap-2">
//                 <input 
//                   v-model="product.continueWhenOutOfStock" 
//                   type="checkbox" 
//                   id="continueSelling"
//                   class="w-4 h-4"
//                 >
//                 <label for="continueSelling">Continue selling when out of stock</label>
//               </div>
//             </div>
//           </section>
//         </div>
  
//         <!-- Right Column: Categories & Shipping -->
//         <div class="space-y-6">
//           <!-- Categories Section -->
//           <!-- <section class="panel">
//             <h2 class="section-title">Categories</h2>
//             <div class="category-checkboxes space-y-2">
//               <div 
//                 v-for="category in categories" 
//                 :key="category.name"
//                 class="category-group"
//               >
//                 <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     :id="`category-${category.name}`"
//                     :checked="isCategorySelected(category)"
//                     @change="toggleCategory(category, true)"
//                     class="w-4 h-4"
//                   >
//                   <label :for="`category-${category.name}`" class="font-medium">
//                     {{ category.name }}
//                   </label>
//                 </div>
//                 <div v-if="category.children" class="subcategories ml-6 mt-1 space-y-2">
//                   <div 
//                     v-for="child in category.children"
//                     :key="child"
//                     class="flex items-center gap-2"
//                   >
//                     <input
//                       type="checkbox"
//                       :id="`subcategory-${child}`"
//                       :checked="isSubcategorySelected(child)"
//                       @change="toggleCategory({ name: child }, false)"
//                       class="w-4 h-4"
//                     >
//                     <label :for="`subcategory-${child}`">{{ child }}</label>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section> -->
//           <!-- Categories Section -->
// <!-- Categories Section -->
// <section class="panel">
//   <h2 class="section-title">Categories</h2>
//   <div class="category-checkboxes space-y-2">
//     <div 
//       v-for="category in categories" 
//       :key="category.id"
//       class="category-group"
//     >
//       <!-- Parent Category -->
//       <div class="flex items-center gap-2 p-2 bg-gray-50 rounded">
//         <input
//           type="checkbox"
//           :id="`category-${category.id}`"
//           :checked="isCategorySelected(category)"
//           @change="toggleCategory(category, true)"
//           class="w-4 h-4"
//         >
//         <label :for="`category-${category.id}`" class="font-medium">
//           {{ category.name }}
//         </label>
//       </div>

//       <!-- Child Categories -->
//       <div v-if="category.children && category.children.length" class="subcategories ml-6 mt-1 space-y-2">
//         <div 
//           v-for="child in category.children"
//           :key="child.id"
//           class="flex items-center gap-2"
//         >
//           <input
//             type="checkbox"
//             :id="`subcategory-${child.id}`"
//             :checked="isSubcategorySelected(child)"
//             @change="toggleCategory(child, false)"
//             class="w-4 h-4"
//           >
//           <label :for="`subcategory-${child.id}`">{{ child.name }}</label>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>
//           <!-- Shipping Details -->
//           <section class="panel">
//             <h2 class="section-title">Shipping Details</h2>
//             <div class="space-y-4">
//               <div class="form-group">
//                 <label>Weight (kg)</label>
//                 <input 
//                   v-model.number="product.weight" 
//                   type="number" 
//                   step="0.1" 
//                   class="form-input"
//                   placeholder="0.0"
//                 >
//               </div>
  
//               <div class="grid grid-cols-3 gap-4">
//                 <div class="form-group">
//                   <label>Length</label>
//                   <input 
//                     v-model.number="product.dimensions.length" 
//                     type="number" 
//                     class="form-input"
//                     placeholder="cm"
//                   >
//                 </div>
//                 <div class="form-group">
//                   <label>Width</label>
//                   <input 
//                     v-model.number="product.dimensions.width" 
//                     type="number" 
//                     class="form-input"
//                     placeholder="cm"
//                   >
//                 </div>
//                 <div class="form-group">
//                   <label>Height</label>
//                   <input 
//                     v-model.number="product.dimensions.height" 
//                     type="number" 
//                     class="form-input"
//                     placeholder="cm"
//                   >
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>
//       </div>
  
//       <!-- Form Actions -->
//       <div class="sticky bottom-0 bg-white py-4 border-t mt-8 flex justify-end gap-4">
//         <button @click="cancelEdit" class="btn-secondary">
//           Cancel
//         </button>
//         <button @click="saveProduct" class="btn-primary">
//           Save Changes
//         </button>
//       </div>
//     </div>
//   </template>
  

  
  
//   <!-- <script setup>
//   import { ref, computed, onMounted } from 'vue'
//   import { useRoute, useRouter } from 'vue-router'
//   import { TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline'
//   import draggable from 'vuedraggable'
//   import api from '@/services/api'
//   import { toast } from 'vue3-toastify'
  
//   const route = useRoute()
//   const router = useRouter()
  
//   // Product data
//   const product = ref({
//     name: '',
//     description: '',
//     sku: '',
//     price: 0, // Original price
//     discountPercentage: 0,
//     stock: 0,
//     // images: [],
//     trackInventory: true,
//     continueWhenOutOfStock: false,
//     weight: 0,
//     dimensions: { length: 0, width: 0, height: 0 }
//   })
  
//   // Categories data
//   const categories = ref([
//     {
//       name: 'Electronics',
//       children: ['Laptops', 'Smartphones', 'Wearables', 'Headphones', 'Cameras', 'Streaming Devices', 'Gaming Consoles', 'Printers', 'Speakers', 'Books & E-Readers'],
//     },
//     {
//       name: 'Home Appliances',
//       children: ['Kitchen Appliances', 'Air Purifiers', 'Vacuum Cleaners'],
//     },
//     {
//       name: 'Furniture & Office Supplies',
//       children: ['Ergonomic Chairs', 'Desks and Tables'],
//     },
//     {
//       name: 'Fashion & Accessories',
//       children: ['Clothing', 'Watches', 'Shoes', 'Bags'],
//     },
//     {
//       name: 'Beauty & Health',
//       children: ['Skin Care', 'Toothbrushes', 'Fitness Equipment'],
//     },
//     {
//       name: 'Entertainment & Hobbies',
//       children: ['Toys & Collectibles', 'Cutting Machines'],
//     },
//     {
//       name: 'Outdoor & Travel',
//       children: ['Camping Gear', 'Water Bottles', 'Pizza Ovens'],
//     },
//     {
//       name: 'Smart Home & IoT',
//       children: ['Video Doorbells', 'Security Cameras'],
//     },
//   ])
  
//   // Selected categories
//   const selectedCategories = ref([])
//   const selectedSubcategories = ref([])

// //   const mainImage = ref('')

  
//   // Price handling
//   const sellingPrice = ref(0)
  
//   // Computed properties for price calculations
//   const originalPrice = computed({
//     get: () => product.value.price,
//     set: (value) => {
//       const newPrice = Number(value) || 0
//       product.value.price = newPrice
//       // Update discount percentage based on new original price and current selling price
//       if (newPrice > 0 && sellingPrice.value > 0) {
//         const newDiscount = ((newPrice - sellingPrice.value) / newPrice) * 100
//         product.value.discountPercentage = Math.min(Math.max(newDiscount, 0), 75)
//       }
//     }
//   })
  
//   const currentDiscount = computed({
//     get: () => product.value.discountPercentage,
//     set: (value) => {
//       const newDiscount = Math.min(Math.max(Number(value) || 0, 0), 75)
//       product.value.discountPercentage = newDiscount
//       // Update selling price based on new discount
//       sellingPrice.value = originalPrice.value * (1 - (newDiscount / 100))
//     }
//   })
  
//   // Update selling price directly
//   const updateSellingPrice = (newSellingPrice) => {
//     const sp = Number(newSellingPrice) || 0
//     sellingPrice.value = sp
//     // Update discount percentage based on new selling price
//     if (originalPrice.value > 0) {
//       const newDiscount = ((originalPrice.value - sp) / originalPrice.value) * 100
//       product.value.discountPercentage = Math.min(Math.max(newDiscount, 0), 75)
//     }
//   }
  
//   // Category handling
// //   const isCategorySelected = (category) => {
// //     return selectedCategories.value.includes(category.name) ||
// //       (category.children && category.children.some(child => selectedSubcategories.value.includes(child)))
// //   }
  
// //   const isSubcategorySelected = (subcategory) => {
// //     return selectedSubcategories.value.includes(subcategory)
// //   }
// // Update the category checking logic
// const isCategorySelected = (category) => {
//   return selectedCategories.value.includes(category.name) || 
//     category.children?.some(child => selectedSubcategories.value.includes(child))
// }

// const isSubcategorySelected = (subcategory) => {
//   return selectedSubcategories.value.includes(subcategory)
// }
  
//   const toggleCategory = (category, isParent) => {
//     if (isParent) {
//       // Toggle parent category and all children
//       if (selectedCategories.value.includes(category.name)) {
//         // Remove parent and all children
//         selectedCategories.value = selectedCategories.value.filter(c => c !== category.name)
//         if (category.children) {
//           selectedSubcategories.value = selectedSubcategories.value.filter(
//             sc => !category.children.includes(sc)
//           )
//         }
//       } else {
//         // Add parent and all children
//         selectedCategories.value = [...selectedCategories.value, category.name]
//         if (category.children) {
//           selectedSubcategories.value = [
//             ...selectedSubcategories.value,
//             ...category.children.filter(child => !selectedSubcategories.value.includes(child))
//           ]
//         }
//       }
//     } else {
//       // Toggle child category
//       if (selectedSubcategories.value.includes(category.name)) {
//         selectedSubcategories.value = selectedSubcategories.value.filter(
//           sc => sc !== category.name
//         )
//         // Check if parent should be deselected
//         const parent = categories.value.find(cat => 
//           cat.children?.includes(category.name))
//         if (parent && isCategorySelected(parent)) {
//           selectedCategories.value = selectedCategories.value.filter(
//             c => c !== parent.name
//           )
//         }
//       } else {
//         selectedSubcategories.value = [...selectedSubcategories.value, category.name]
//         // Check if parent should be selected
//         const parent = categories.value.find(cat => 
//           cat.children?.includes(category.name))
//         if (parent && !selectedCategories.value.includes(parent.name)) {
//           selectedCategories.value = [...selectedCategories.value, parent.name]
//         }
//       }
//     }
//   }
  
//   // Load product data
//   onMounted(async () => {
//     try {
//       const response = await api.get(`/admin/products/${route.params.id}`)
//       const productData = response.data
//       console.log('Product data from backend:', productData);

      
//       // Update product data
//       product.value = {
//         ...product.value,
//         ...productData,
//         price: Number(productData.price) || 0,
//         discountPercentage: Number(productData.discountPercentage) || 0,
//         dimensions: productData.dimensions || { length: 0, width: 0, height: 0 }
//       }
  
//       // Calculate initial selling price
//       sellingPrice.value = product.value.price * (1 - (product.value.discountPercentage / 100))
  
//       // Load categories
//     //   const loadedCategories = productData.categories || []
//     //   selectedCategories.value = loadedCategories
//     //     .filter(cat => categories.value.some(c => c.name === cat.name && !c.children?.includes(cat.name)))
//     //     .map(c => c.name)
        
//     //   selectedSubcategories.value = loadedCategories
//     //     .filter(cat => categories.value.some(c => c.children?.includes(cat.name)))
//     //     .map(c => c.name)
//     // Load categories - REVISED
//     const loadedCategories = productData.categories || []
//     selectedCategories.value = loadedCategories
//       .filter(cat => categories.value.some(c => c.name === cat.name))
//       .map(c => c.name)
      
//     selectedSubcategories.value = loadedCategories
//       .filter(cat => categories.value.some(c => 
//         c.children?.includes(cat.name)
//       ))
//       .map(c => c.name)
  
//       // Load images
//     //   if (product.value.images.length > 0) {
//     //     mainImage.value = product.value.images[0]
//     //   }
//     } catch (error) {
//       toast.error('Failed to load product')
//     //   router.push('/admin/products')
//     }
//   })
  
//   // Save product
// //   const saveProduct = async () => {
// //     try {
// //       const payload = {
// //         ...product.value,
// //         categoryIds: [
// //           ...selectedCategories.value,
// //           ...selectedSubcategories.value
// //         ].map(name => 
// //           categories.value.find(c => c.name === name)?.id || 
// //           categories.value.flatMap(c => c.children).indexOf(name) + 1
// //         )
// //       }
  
// //       await api.put(`/admin/products/${route.params.id}`, payload)
// //       toast.success('Product updated successfully')
// //       router.push('/admin/products')
// //     } catch (error) {
// //       toast.error(error.response?.data?.error || 'Failed to update product')
// //     }
// //   }
// // const saveProduct = async () => {
// //   try {
// //     // Validate categories
// //     const categoryIds = [
// //       ...selectedCategories.value,
// //       ...selectedSubcategories.value
// //     ].map(name => {
// //       // Find the category by name
// //       const category = categories.value.find(c => c.name === name);
// //       if (!category) {
// //         throw new Error(`Category "${name}" not found`);
// //       }
// //       return category.id;
// //     });

// //     // Prepare payload
// //     const payload = {
// //       ...product.value,
// //       categoryIds
// //     };

// //     // Save product
// //     await api.put(`/admin/products/${route.params.id}`, payload);
// //     toast.success('Product updated successfully');
// //     router.push('/admin/products');
// //   } catch (error) {
// //     toast.error(error.response?.data?.error || 'Failed to update product');
// //   }
// // };
// // const saveProduct = async () => {
// //   try {
// //     console.log('Starting product update...');

// //     // Validate categories
// //     const categoryIds = [
// //       ...selectedCategories.value,
// //       ...selectedSubcategories.value
// //     ].map(name => {
// //       // Find the category by name
// //       const category = categories.value.find(c => c.name === name);
// //       if (!category) {
// //         throw new Error(`Category "${name}" not found`);
// //       }
// //       return category.id;
// //     });

// //     console.log('Category IDs:', categoryIds);

// //     // Prepare payload
// //     const payload = {
// //       ...product.value,
// //       categoryIds
// //     };

// //     console.log('Payload:', payload);

// //     // Save product
// //     const response = await api.put(`/admin/products/${route.params.id}`, payload);
// //     console.log('Update response:', response.data);

// //     toast.success('Product updated successfully');
// //     // router.push('/admin/products');
// //   } catch (error) {
// //     console.error('Error updating product:', error);

// //     if (error.response) {
// //       // Backend error
// //       console.error('Backend error details:', error.response.data);
// //       toast.error(error.response.data.error || 'Failed to update product');
// //     } else if (error.request) {
// //       // No response from backend
// //       console.error('No response from backend:', error.request);
// //       toast.error('Network error: Could not connect to the server');
// //     } else {
// //       // Frontend error
// //       console.error('Frontend error:', error.message);
// //       toast.error(error.message || 'Failed to update product');
// //     }
// //   }
// // };
// const saveProduct = async () => {
//   try {
//     console.log('Starting product update...');

//     // Validate categories
//     const categoryIds = [
//       ...selectedCategories.value,
//       ...selectedSubcategories.value
//     ].map(name => {
//       // Find the category by name
//       const category = categories.value.find(c => c.name === name);
//       if (!category) {
//         throw new Error(`Category "${name}" not found. Please ensure it exists in the categories list.`);
//       }
//       return category.id;
//     });

//     console.log('Category IDs:', categoryIds);

//     // Prepare payload
//     const payload = {
//       ...product.value,
//       categoryIds
//     };

//     console.log('Payload:', payload);

//     // Save product
//     const response = await api.put(`/admin/products/${route.params.id}`, payload);
//     console.log('Update response:', response.data);

//     toast.success('Product updated successfully');
//     router.push('/admin/products');
//   } catch (error) {
//     console.error('Error updating product:', error);

//     if (error.response) {
//       // Backend error
//       console.error('Backend error details:', error.response.data);
//       toast.error(error.response.data.error || 'Failed to update product');
//     } else if (error.request) {
//       // No response from backend
//       console.error('No response from backend:', error.request);
//       toast.error('Network error: Could not connect to the server');
//     } else {
//       // Frontend error
//       console.error('Frontend error:', error.message);
//       toast.error(error.message || 'Failed to update product');
//     }
//   }
// };
  
//   const cancelEdit = () => router.push('/admin/products')
//   </script> -->
//   <script setup>
// import { ref, computed, onMounted } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
// import { TrashIcon, PlusCircleIcon } from '@heroicons/vue/24/outline'
// import draggable from 'vuedraggable'
// import api from '@/services/api'
// import { toast } from 'vue3-toastify'

// const route = useRoute()
// const router = useRouter()

// // Product data
// const product = ref({
//   name: '',
//   description: '',
//   sku: '',
//   price: 0, // Original price
//   discountPercentage: 0,
//   costPrice: 0, // Initialize costPrice to 0
//   stock: 0,
//   // images: [],
//   trackInventory: true,
//   continueWhenOutOfStock: false,
//   weight: 0,
//   dimensions: { length: 0, width: 0, height: 0 }
// })

// // Categories data
// const categories = ref([
//   {
//     id: 1,
//     name: 'Electronics',
//     isMain: true,
//     children: [
//       { id: 101, name: 'Laptops' },
//       { id: 102, name: 'Smartphones' },
//       { id: 103, name: 'Wearables' },
//       { id: 104, name: 'Headphones' },
//       { id: 105, name: 'Cameras' },
//       { id: 106, name: 'Streaming Devices' },
//       { id: 107, name: 'Gaming Consoles' },
//       { id: 108, name: 'Printers' },
//       { id: 109, name: 'Speakers' },
//       { id: 110, name: 'Books & E-Readers' }
//     ]
//   },
//   {
//     id: 2,
//     name: 'Home Appliances',
//     isMain: true,
//     children: [
//       { id: 201, name: 'Kitchen Appliances' },
//       { id: 202, name: 'Air Purifiers' },
//       { id: 203, name: 'Vacuum Cleaners' }
//     ]
//   },
//   {
//     id: 3,
//     name: 'Furniture & Office Supplies',
//     isMain: true,
//     children: [
//       { id: 301, name: 'Ergonomic Chairs' },
//       { id: 302, name: 'Desks and Tables' }
//     ]
//   },
//   {
//     id: 4,
//     name: 'Fashion & Accessories',
//     isMain: true,
//     children: [
//       { id: 401, name: 'Clothing' },
//       { id: 402, name: 'Watches' },
//       { id: 403, name: 'Shoes' },
//       { id: 404, name: 'Bags' }
//     ]
//   },
//   {
//     id: 5,
//     name: 'Beauty & Health',
//     isMain: true,
//     children: [
//       { id: 501, name: 'Skin Care' },
//       { id: 502, name: 'Toothbrushes' },
//       { id: 503, name: 'Fitness Equipment' }
//     ]
//   },
//   {
//     id: 6,
//     name: 'Entertainment & Hobbies',
//     isMain: true,
//     children: [
//       { id: 601, name: 'Toys & Collectibles' },
//       { id: 602, name: 'Cutting Machines' }
//     ]
//   },
//   {
//     id: 7,
//     name: 'Outdoor & Travel',
//     isMain: true,
//     children: [
//       { id: 701, name: 'Camping Gear' },
//       { id: 702, name: 'Water Bottles' },
//       { id: 703, name: 'Pizza Ovens' }
//     ]
//   },
//   {
//     id: 8,
//     name: 'Smart Home & IoT',
//     isMain: true,
//     children: [
//       { id: 801, name: 'Video Doorbells' },
//       { id: 802, name: 'Security Cameras' }
//     ]
//   }
// ]);

// // Selected categories
// const selectedCategories = ref([])
// const selectedSubcategories = ref([])

// // Price handling
// const sellingPrice = ref(0)

// // Computed properties for price calculations
// const originalPrice = computed({
//   get: () => product.value.price,
//   set: (value) => {
//     const newPrice = Number(value) || 0
//     product.value.price = newPrice
//     // Update discount percentage based on new original price and current selling price
//     if (newPrice > 0 && sellingPrice.value > 0) {
//       const newDiscount = ((newPrice - sellingPrice.value) / newPrice) * 100
//       product.value.discountPercentage = Math.min(Math.max(newDiscount, 0), 75)
//     }
//   }
// })


// const currentDiscount = computed({
//   get: () => Math.round(product.value.discountPercentage),
//   set: (value) => {
//     const roundedValue = Math.min(Math.max(Math.round(Number(value) || 0), 0), 75);
//     product.value.discountPercentage = roundedValue; // Ensure the product value is rounded
//     sellingPrice.value = originalPrice.value * (1 - (roundedValue / 100));
//   }
// });

// const updateSellingPrice = (newSellingPrice) => {
//   const sp = Number(newSellingPrice) || 0;
//   sellingPrice.value = sp;
//   if (originalPrice.value > 0) {
//     const newDiscount = Math.min(Math.max(Math.round(((originalPrice.value - sp) / originalPrice.value) * 100), 0), 75);
//     product.value.discountPercentage = newDiscount; // Ensure the product value is rounded
//   }
// };

// // Category handling

// // Check if a category is selected
// const isCategorySelected = (category) => {
//   return selectedCategories.value.some(c => c.id === category.id);
// };

// // Check if a subcategory is selected
// const isSubcategorySelected = (subcategory) => {
//   return selectedSubcategories.value.some(c => c.id === subcategory.id);
// };

// // Toggle category or subcategory
// const toggleCategory = (category, isParent) => {
//   if (isParent) {
//     // Handle parent category
//     const exists = selectedCategories.value.some(c => c.id === category.id);
//     if (exists) {
//       // Remove parent and all its children
//       selectedCategories.value = selectedCategories.value.filter(c => c.id !== category.id);
//       selectedSubcategories.value = selectedSubcategories.value.filter(
//         sc => !category.children.some(child => child.id === sc.id)
//       );
//     } else {
//       // Add parent and all its children
//       selectedCategories.value = [...selectedCategories.value, category];
//       selectedSubcategories.value = [
//         ...selectedSubcategories.value,
//         ...category.children.filter(child => 
//           !selectedSubcategories.value.some(sc => sc.id === child.id)
//         )
//       ];
//     }
//   } else {
//     // Handle subcategory
//     const exists = selectedSubcategories.value.some(c => c.id === category.id);
//     if (exists) {
//       // Remove subcategory
//       selectedSubcategories.value = selectedSubcategories.value.filter(c => c.id !== category.id);
//       // Check if parent should be deselected
//       const parent = categories.value.find(c => c.children?.some(ch => ch.id === category.id));
//       if (parent && !parent.children.some(ch => selectedSubcategories.value.some(sc => sc.id === ch.id))) {
//         selectedCategories.value = selectedCategories.value.filter(c => c.id !== parent.id);
//       }
//     } else {
//       // Add subcategory
//       selectedSubcategories.value = [...selectedSubcategories.value, category];
//       // Ensure parent is selected
//       const parent = categories.value.find(c => c.children?.some(ch => ch.id === category.id));
//       if (parent && !selectedCategories.value.some(c => c.id === parent.id)) {
//         selectedCategories.value = [...selectedCategories.value, parent];
//       }
//     }
//   }
// };
// // Load product data
// onMounted(async () => {
//   try {
//     // Load categories
//     const catResponse = await api.get('/products/categories');
//     console.log('Fetched categories:', catResponse.data); // Debug log
//     categories.value = catResponse.data;

//     // Load product data
//     const response = await api.get(`/admin/products/${route.params.id}`);
//     const productData = response.data;

//     // Update product data
//     product.value = {
//       ...product.value,
//       ...productData,
//       price: Number(productData.price) || 0,
//       discountPercentage: Number(productData.discountPercentage) || 0,
//       costPrice: Number(productData.costPrice) || 0, // Add costPrice here
//       dimensions: productData.dimensions || { length: 0, width: 0, height: 0 }
//     };

//     // Set selected categories
//     selectedCategories.value = productData.categories
//       .filter(cat => cat.isMainCategory)
//       .map(cat => ({
//         id: cat.id,
//         name: cat.name,
//         isMain: cat.isMainCategory
//       }));

//     selectedSubcategories.value = productData.categories
//       .filter(cat => !cat.isMainCategory)
//       .map(cat => ({
//         id: cat.id,
//         name: cat.name,
//         isMain: cat.isMainCategory
//       }));

//     // Calculate initial selling price
//     sellingPrice.value = product.value.price * (1 - (product.value.discountPercentage / 100));

//   } catch (error) {
//     console.error('Error loading product:', error);
//     toast.error('Failed to load product');
//   }
// });
// // Save product
// const saveProduct = async () => {
//   try {
//     const payload = {
//       ...product.value,
//       categoryIds: [
//         ...selectedCategories.value.map(c => c.id),
//         ...selectedSubcategories.value.map(c => c.id)
//       ]
//     };

//     await api.put(`/admin/products/${route.params.id}`, payload);
//     toast.success('Product updated successfully');
//   } catch (error) {
//     toast.error(error.response?.data?.error || 'Failed to update product');
//   }
// };
// const cancelEdit = () => router.push('/admin/manage-products')
// </script>
  
//   <style scoped>
//   .product-edit-container {
//     max-width: 1300px;
//     margin: 0 auto;
//     padding-left: 3rem;
//     padding-right: 3rem;
//   }
  
//   .panel {
//     @apply bg-white rounded-lg p-6 shadow-sm border border-gray-200;
//   }
  
//   .section-title {
//     @apply text-lg font-semibold mb-4 pb-2 border-b border-gray-200;
//   }
  
//   .form-input {
//     @apply w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500;
//   }
  
//   .btn-primary {
//     @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors;
//   }
  
//   .btn-secondary {
//     @apply px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors;
//   }
  
//   .main-image-container {
//     @apply relative aspect-square bg-gray-100 rounded-lg overflow-hidden;
//   }
  
//   .thumbnail-container {
//     @apply relative aspect-square;
//   }
  
//   .upload-box {
//     @apply p-4 text-center cursor-pointer transition-colors;
//   }
  
//   .category-checkboxes {
//     @apply space-y-2 p-2;
//   }
  
//   .category-group {
//     @apply space-y-1;
//   }
//   </style> 















// <!-- components/AdminOrderManagement.vue -->
// <template>
//   <div class="admin-order-management">
//     <h1>Order Management</h1>

//     <div class="filters">
//       <!-- Checkbox to filter out Pending orders -->
//       <label>
//         <input 
//           type="checkbox" 
//           v-model="hidePendingOrders" 
//         />
//         Hide Pending Orders
//       </label>

//       <!-- Checkbox to filter out Delivered orders -->
//       <label>
//         <input 
//           type="checkbox" 
//           v-model="hideDeliveredOrders" 
//         />
//         Hide Delivered Orders
//       </label>

//       <!-- Status filter dropdown -->
//       <select v-model="statusFilter">
//         <option value="">All Statuses</option>
//         <option v-for="status in orderStatuses" :key="status">
//           {{ status }}
//         </option>
//       </select>

//       <!-- Search input -->
//       <input 
//         v-model="searchQuery" 
//         placeholder="Search by Order ID or Username"
//       />
//     </div>

//     <!-- Loading state -->
//     <div v-if="orderManagementStore.loading" class="loading">
//       Loading orders...
//     </div>

//     <!-- Error state -->
//     <div v-else-if="orderManagementStore.error" class="error">
//       {{ orderManagementStore.error }}
//     </div>

//     <!-- Orders table -->
//     <table v-else-if="orderManagementStore.orders?.length" class="orders-table">
//       <thead>
//         <tr>
//           <th>Order ID</th>
//           <th>User</th>
//           <th>Total Amount</th>
//           <th>Status</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         <tr 
//           v-for="order in filteredOrders" 
//           :key="order.id"
//           @click="selectedOrder = order"
//         >
//           <td>{{ order.id }}</td>
//           <td>{{ order.User?.username || 'Unknown User' }}</td>
//           <td>${{ order.totalAmount.toFixed(2) }}</td>
//           <td>
//             <span :class="getStatusClass(order.status)">
//               {{ order.status }}
//             </span>
//           </td>
//           <td>
//             <div class="action-buttons">
//               <template v-if="order.status === 'Processing'">
//                 <button @click.stop="updateToShipping(order)">Update to Shipping</button>
//                 <input 
//                   type="date" 
//                   v-model="shippingDates[order.id]" 
//                   placeholder="Estimated Shipping Date"
//                   @click.stop
//                 />
//               </template>
//               <template v-if="order.status === 'Shipping'">
//                 <button @click.stop="updateToDelivering(order)">Update to Delivering</button>
//                 <input 
//                   type="datetime-local" 
//                   v-model="deliveryDates[order.id]" 
//                   placeholder="Exact Delivery Time"
//                   @click.stop
//                 />
//               </template>
//               <template v-if="order.status === 'Delivering'">
//                 <button @click.stop="updateToDelivered(order)">Update to Delivered</button>
//               </template>
//             </div>
//           </td>
//         </tr>
//       </tbody>
//     </table>

//     <!-- No orders available -->
//     <div v-else>
//       <p>No orders available to display.</p>
//     </div>

//     <!-- Order detail modal -->
//     <OrderDetailModal 
//       v-if="selectedOrder"
//       :order="selectedOrder"
//       @close="selectedOrder = null"
//     />
//   </div>
// </template>

// <script setup>
// import { ref, computed, onMounted, onUnmounted } from 'vue';
// import { useOrderManagementStore } from '@/stores/orderManagementStore';
// import OrderDetailModal from './OrderDetailModal.vue';

// const orderManagementStore = useOrderManagementStore();
// const selectedOrder = ref(null);
// const statusFilter = ref('');
// const searchQuery = ref('');
// const shippingDates = ref({});
// const deliveryDates = ref({});
// const hidePendingOrders = ref(true); // Checkbox to hide Pending orders (checked by default)
// const hideDeliveredOrders = ref(true); // Checkbox to hide Delivered orders (checked by default)

// const orderStatuses = [
//   'Pending', 
//   'Processing', 
//   'Shipping', 
//   'Delivering', 
//   'Delivered', 
//   'Cancelled'
// ];

// // Computed property to filter orders
// const filteredOrders = computed(() => {
//   const orders = orderManagementStore.orders || []; // Default to empty array
//   return orders.filter(order => {
//     const matchStatus = !statusFilter.value || 
//       order.status === statusFilter.value;

//     const matchSearch = !searchQuery.value || 
//       order.id.toString().includes(searchQuery.value) ||
//       order.User?.username?.toLowerCase().includes(searchQuery.value.toLowerCase());

//     // Exclude Pending orders if checkbox is checked
//     const excludePending = hidePendingOrders.value ? order.status !== 'Pending' : true;

//     // Exclude Delivered orders if checkbox is checked
//     const excludeDelivered = hideDeliveredOrders.value ? order.status !== 'Delivered' : true;

//     return matchStatus && matchSearch && excludePending && excludeDelivered;
//   });
// });

// // Function to get status class for styling
// function getStatusClass(status) {
//   const statusClasses = {
//     'Pending': 'status-pending',
//     'Processing': 'status-processing',
//     'Shipping': 'status-shipping',
//     'Delivering': 'status-delivering',
//     'Delivered': 'status-delivered',
//     'Cancelled': 'status-cancelled'
//   };
//   return statusClasses[status] || '';
// }

// // Function to update order status to Shipping
// const updateToShipping = async (order) => {
//   const shippingDate = shippingDates.value[order.id];
//   if (!shippingDate) {
//     alert('Please select a shipping date');
//     return;
//   }
//   try {
//     await orderManagementStore.updateOrderStatus(order.id, 'Shipping', shippingDate);
//   } catch (error) {
//     alert('Failed to update order status');
//     console.error('Error updating to Shipping:', error);
//   }
// };

// // Function to update order status to Delivering
// const updateToDelivering = async (order) => {
//   const deliveryDateTime = deliveryDates.value[order.id];
//   if (!deliveryDateTime) {
//     alert('Please select a delivery date and time');
//     return;
//   }
//   try {
//     await orderManagementStore.updateOrderStatus(order.id, 'Delivering', deliveryDateTime);
//   } catch (error) {
//     alert('Failed to update order status');
//     console.error('Error updating to Delivering:', error);
//   }
// };

// // Function to update order status to Delivered
// const updateToDelivered = async (order) => {
//   try {
//     await orderManagementStore.updateOrderStatus(order.id, 'Delivered');
//   } catch (error) {
//     alert('Failed to update order status');
//     console.error('Error updating to Delivered:', error);
//   }
// };

// // Fetch orders and initialize WebSocket on component mount
// onMounted(() => {
//   orderManagementStore.fetchOrders();
//   orderManagementStore.initializeWebSocket();
// });

// // Close WebSocket on component unmount
// onUnmounted(() => {
//   if (orderManagementStore.socket) {
//     orderManagementStore.socket.close();
//   }
// });
// </script>

// <style scoped>
// .admin-order-management {
//   padding: 20px;
// }

// .filters {
//   display: flex;
//   gap: 10px;
//   margin-bottom: 20px;
//   align-items: center;
// }

// .orders-table {
//   width: 100%;
//   border-collapse: collapse;
// }

// .orders-table th, 
// .orders-table td {
//   border: 1px solid #ddd;
//   padding: 8px;
//   text-align: left;
// }

// .action-buttons {
//   display: flex;
//   gap: 5px;
// }

// /* Status Color Classes */
// .status-pending { color: orange; }
// .status-processing { color: blue; }
// .status-shipping { color: brown; }
// .status-delivering { color: rgb(77, 219, 77); }
// .status-delivered { color: teal; }
// .status-cancelled { color: red; }
// </style>