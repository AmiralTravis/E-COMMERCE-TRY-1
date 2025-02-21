<!-- /components/UserProfile.vue -->
<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <h1 class="text-4xl font-bold text-gray-900 mb-10">My Profile</h1>

      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 border-2 border-red-200 rounded-lg p-6 text-red-700 text-lg">
        {{ error }}
      </div>

      <!-- Profile Content -->
      <div v-else class="space-y-8">
        <!-- Profile Card -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <!-- Avatar and Basic Info Section -->
          <div class="p-8 border-b border-gray-100 flex flex-col sm:flex-row items-start gap-8">
            <!-- Avatar Section -->
            <div class="relative group">
              <div class="relative">
                <img
                  :src="profilePicUrl"
                  class="h-40 w-40 rounded-full object-cover ring-4 ring-gray-100"
                  @error="handleImageError"
                />
                <!-- Edit Icon -->
                <div class="absolute bottom-0 right-0 bg-gray-300 rounded-full p-2 shadow-sm">
                  <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Hover Overlay -->
              <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div class="bg-black bg-opacity-50 rounded-full h-40 w-40 flex items-center justify-center">
                  <div class="space-y-2 text-center">
                    <button @click="fileInput?.click()" class="text-sm text-white hover:text-gray-200 transition-colors mb-2">
                        {{ hasCustomAvatar ? 'Change Photo' : 'Add Photo' }}
                    </button>
                    <button 
                      v-if="hasCustomAvatar"
                      @click="removeAvatar"
                      class="text-sm text-red-300 hover:text-red-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
              
              <input 
                type="file" 
                ref="fileInput" 
                @change="handleFileSelect" 
                accept="image/*" 
                class="hidden"
              />
            </div>
            <!-- Basic Info Section -->
            <div class="flex-1 w-full">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Username</label>
                    <input
                      v-model="computedUsername"
                      type="text"
                      class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-500">Email</label>
                    <input
                      v-model="computedEmail"
                      type="email"
                      class="mt-1 w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div class="space-y-4">
                  <div class="flex justify-end pt-4">
                    <button
                      @click="saveBasicInfo"
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Change Password Section -->
          <div class="p-8 border-t border-gray-100">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-2xl font-semibold text-gray-900">Change Password</h3>
            </div>

            <form @submit.prevent="changePassword" class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-500">Current Password</label>
                <div class="relative w-1/2">
                  <input
                    v-model="currentPassword"
                    :type="showCurrentPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    @click="showCurrentPassword = !showCurrentPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none bg-transparent"
                  >
                    <svg v-if="!showCurrentPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-500">New Password</label>
                <div class="relative w-1/2">
                  <input
                    v-model="newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none bg-transparent"
                  >
                    <svg v-if="!showNewPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-500">Confirm New Password</label>
                <div class="relative w-1/2">
                  <input
                    v-model="confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500 pr-10"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 focus:outline-none bg-transparent"
                  >
                    <svg v-if="!showConfirmPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 hover:text-blue-800 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  </button>
                </div>
              </div>

              <div v-if="passwordError" class="text-red-600 text-sm">{{ passwordError }}</div>
              <div v-if="passwordSuccess" class="text-green-600 text-sm">{{ passwordSuccess }}</div>

              <button
                type="submit"
                :disabled="isChangingPassword"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {{ isChangingPassword ? 'Updating...' : 'Change Password' }}
              </button>
            </form>
          </div>

          <!-- Addresses Section -->
          <!-- Addresses Section -->
<div class="p-8 border-t border-gray-100">
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
            ></textarea>
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
            ></textarea>
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
      :class="address.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200'"
    >
      <!-- Address Type Badges -->
      <div class="mb-4 space-y-2">
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
            ></textarea>
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
            ></textarea>
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
      </div>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>

    <!-- Success Toast Notification -->
    <div
      v-if="showToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity duration-300"
      :class="{ 'opacity-0': !showToast }"
    >
      {{ toastMessage }}
    </div>

    <!-- Image Cropper Modal -->
    <ImageCropperModal
      v-if="showCropper"
      :image-src="cropperImage"
      @cancel="handleCropperCancel"
      @save="handleCroppedImage"
    />
  </div>
</template>


<script>
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';
import ImageCropperModal from './ImageCropperModal.vue';

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
  phoneNumber: {
    max: 15,
    pattern: /^[0-9]{6,15}$/,
    message: 'Phone number must be 6-15 digits'
  }
};

const initNewAddress = () => ({
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
});

export default defineComponent({
  name: 'UserProfile',
  components: {
    ImageCropperModal
  },
  setup() {
    const authStore = useAuthStore();
    
    // Profile state
    const profilePicUrl = ref(null);
    const isLoading = ref(true);
    const error = ref(null);
    const showCropper = ref(false);
    const cropperImage = ref(null);
    const fileInput = ref(null);
    const showToast = ref(false);
    const toastMessage = ref('');
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const passwordError = ref('');
    const passwordSuccess = ref('');
    const isChangingPassword = ref(false);
    const showCurrentPassword = ref(false);
    const showNewPassword = ref(false);
    const showConfirmPassword = ref(false);

    // Address state
    const localAddresses = ref([]);
    const showNewAddressForm = ref(false);
    const editingAddressId = ref(null);
    const editedAddress = ref(null);
    const originalAddresses = ref([]);
    const newAddress = ref(initNewAddress());
    const validationErrors = ref({});
    const countries = ref([
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
    ]);

    // Computed properties
    const hasCustomAvatar = computed(() => {
      return authStore.user?.profilePicUrl && 
            !authStore.user.profilePicUrl.includes('generated-avatar');
    });

    const isAddButtonDisabled = computed(() => {
      return localAddresses.value.length >= 5;
    });

    const computedUsername = computed({
      get: () => authStore.user?.username || '',
      set: (newValue) => {
        if (authStore.user) {
          authStore.user.username = newValue;
        }
      }
    });

    const computedEmail = computed({
      get: () => authStore.user?.email || '',
      set: (newValue) => {
        if (authStore.user) {
          authStore.user.email = newValue;
        }
      }
    });



    const showToastMessage = (message, type = 'success') => {
      toastMessage.value = message;
      showToast.value = true;
      setTimeout(() => {
        showToast.value = false;
      }, 3000);
    };

    // Profile methods
    const saveBasicInfo = async () => {
      try {
        const userData = {
          username: authStore.user.username,
          email: authStore.user.email,
        };
        await authStore.updateProfile(userData);
        showToastMessage('Profile information updated successfully');
        await authStore.fetchUserData();
      } catch (error) {
        console.error('Error updating profile:', error);
        showToastMessage(error.message || 'Failed to update profile information', 'error');
      }
    };

    const handleFileSelect = (event) => {
      const file = event.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToastMessage('Please upload a valid image file', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToastMessage('File size must be less than 5MB', 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        cropperImage.value = e.target.result;
        showCropper.value = true;
      };
      reader.readAsDataURL(file);
    };

    const handleCroppedImage = async (blob) => {
      try {
        const formData = new FormData();
        const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
        formData.append('image', file);

        const response = await api.post('/profile/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        profilePicUrl.value = `${response.data.profilePicUrl}?t=${Date.now()}`;
        await authStore.fetchUserData();
        showToastMessage('Profile picture updated successfully');
      } catch (error) {
        console.error('Upload error:', error);
        showToastMessage('Failed to upload profile picture', 'error');
      } finally {
        showCropper.value = false;
        if (fileInput.value) {
          fileInput.value.value = '';
        }
      }
    };

    // Handle cropper cancel
    const handleCropperCancel = () => {
      showCropper.value = false;
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };

    const removeAvatar = async () => {
      try {
        await api.delete('/profile/remove');
        await authStore.fetchUserData();
        profilePicUrl.value = authStore.user.profilePicUrl;
        showToastMessage('Profile picture removed successfully');
      } catch (error) {
        console.error('Remove error:', error);
        showToastMessage('Failed to remove profile picture', 'error');
      }
    };

    // Address methods
    const fetchAddresses = async () => {
      try {
        const response = await api.get(`/addresses/user-addresses/${authStore.user.id}`);
        localAddresses.value = response.data;
        originalAddresses.value = JSON.parse(JSON.stringify(localAddresses.value));
      } catch (error) {
        console.error('Error fetching addresses:', error);
        showToastMessage('Failed to load addresses', 'error');
      }
    };

    const validateField = (field, value) => {
      const rules = VALIDATION_RULES[field];
      if (!rules) return true;

      if (rules.max && value.length > rules.max) {
        return rules.message;
      }

      if (rules.pattern && !rules.pattern.test(value)) {
        return rules.message;
      }

      return true;
    };

    const validateAddress = (address) => {
      const errors = {};
      Object.keys(VALIDATION_RULES).forEach(field => {
        const error = validateField(field, address[field]);
        if (error !== true) {
          errors[field] = error;
        }
      });
      return Object.keys(errors).length ? errors : true;
    };

    const toggleNewAddressForm = () => {
      showNewAddressForm.value = !showNewAddressForm.value;
      if (!showNewAddressForm.value) {
        newAddress.value = initNewAddress();
      }
    };

    const saveNewAddress = async () => {
      const validation = validateAddress(newAddress.value);
      if (validation !== true) {
        validationErrors.value = validation;
        return;
      }

      try {
        await api.post('/addresses/save-address', {
          ...newAddress.value,
          userId: authStore.user.id
        });
        await fetchAddresses();
        showNewAddressForm.value = false;
        showToastMessage('Address added successfully');
      } catch (error) {
        console.error('Error saving new address:', error);
        showToastMessage('Failed to add address', 'error');
      }
    };

    const enterEditMode = (address) => {
      editingAddressId.value = address.id;
      editedAddress.value = JSON.parse(JSON.stringify(address));
    };

    const cancelEdit = () => {
      editingAddressId.value = null;
      editedAddress.value = null;
    };

    const updateAddress = async (address) => {
      const validation = validateAddress(address);
      if (validation !== true) {
        validationErrors.value = validation;
        return;
      }

      try {
        await api.put(`/addresses/${address.id}`, address);
        await fetchAddresses();
        editingAddressId.value = null;
        showToastMessage('Address updated successfully');
      } catch (error) {
        console.error('Error updating address:', error);
        showToastMessage('Failed to update address', 'error');
      }
    };

    // const setDefault = async (id) => {
    //   try {
    //     await api.post('/addresses/set-default', { id });
    //     await fetchAddresses();
    //     showToastMessage('Default address updated');
    //   } catch (error) {
    //     console.error('Error setting default address:', error);
    //     showToastMessage('Failed to set default address', 'error');
    //   }
    // };
    const setDefault = async (id) => {
  try {
    await api.put(`/addresses/${id}/set-default`);
    await fetchAddresses();
    showToastMessage('Default address updated');
  } catch (error) {
    console.error('Error setting default address:', error);
    showToastMessage('Failed to set default address', 'error');
  }
};

    const deleteAddress = async (id) => {
      if (!confirm('Are you sure you want to delete this address?')) return;
      
      try {
        await api.delete(`/addresses/${id}`);
        await fetchAddresses();
        showToastMessage('Address deleted successfully');
      } catch (error) {
        console.error('Error deleting address:', error);
        showToastMessage('Failed to delete address', 'error');
      }
    };

    const hasChanges = () => {
      if (!editedAddress.value) return false;
      const original = originalAddresses.value.find(a => a.id === editingAddressId.value);
      return JSON.stringify(editedAddress.value) !== JSON.stringify(original);
    };

    const getFullPhoneNumber = (address) => {
      const country = countries.value.find(c => c.code === address.countryCode);
      return country ? `${country.phone} ${address.phoneNumber}` : address.phoneNumber;
    };

    const initAutoResize = () => {
      const textareas = document.querySelectorAll('textarea');
      textareas.forEach(textarea => {
        const adjustHeight = () => {
          textarea.style.height = 'auto';
          textarea.style.height = `${textarea.scrollHeight}px`;
        };
        adjustHeight();
        textarea.addEventListener('input', adjustHeight);
        textarea.addEventListener('change', adjustHeight);
      });
    };

    // Password methods
    const changePassword = async () => {
      if (newPassword.value !== confirmPassword.value) {
        passwordError.value = 'New passwords do not match';
        return;
      }

      if (newPassword.value.length < 8) {
        passwordError.value = 'Password must be at least 8 characters';
        return;
      }

      isChangingPassword.value = true;
      passwordError.value = '';
      passwordSuccess.value = '';

      try {
        await api.post('/auth/change-password', {
          currentPassword: currentPassword.value,
          newPassword: newPassword.value
        });

        passwordSuccess.value = 'Password changed successfully';
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
      } catch (error) {
        passwordError.value = error.response?.data?.error || 'Failed to change password';
      } finally {
        isChangingPassword.value = false;
      }
    };

    // Initialize
    onMounted(async () => {
      try {
        await authStore.fetchUserData();
        profilePicUrl.value = authStore.user?.profilePicUrl || '';
        await fetchAddresses();
        initAutoResize();
      } catch (err) {
        error.value = 'Failed to load profile data';
        showToastMessage('Failed to load profile data', 'error');
      } finally {
        isLoading.value = false;
      }
    });

    return {
      // Profile state
      profilePicUrl,
      isLoading,
      error,
      showCropper,
      cropperImage,
      showToast,
      toastMessage,
      computedUsername,
      computedEmail,
      hasCustomAvatar,
      fileInput,
      currentPassword,
      newPassword,
      confirmPassword,
      passwordError,
      passwordSuccess,
      isChangingPassword,
      showCurrentPassword,
      showNewPassword,
      showConfirmPassword,

      // Address state
      localAddresses,
      showNewAddressForm,
      editingAddressId,
      editedAddress,
      newAddress,
      validationErrors,
      countries,
      isAddButtonDisabled,

      // Methods
      handleFileSelect,
      handleCroppedImage,
      handleCropperCancel,
      removeAvatar,
      saveBasicInfo,
      changePassword,
      toggleNewAddressForm,
      saveNewAddress,
      enterEditMode,
      cancelEdit,
      updateAddress,
      setDefault,
      deleteAddress,
      hasChanges,
      getFullPhoneNumber
    };
  }
});
</script>


<style scoped>
.cropper-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.cropper-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  padding: 20px;
}

.cropper-header h3 {
  margin: 0 0 15px 0;
}

.cropper-body {
  position: relative;
  height: 400px;
}

.zoom-control {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.zoom-control input[type="range"] {
  flex-grow: 1;
}

.cropper-footer {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  padding: 8px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:last-child {
  background: #007bff;
  color: white;
}

.profile-container {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.profile-content {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.profile-info {
  margin-top: 1rem;
}

h1 {
  margin-bottom: 2rem;
}

h2 {
  color: #333;
  margin-bottom: 1rem;
}

.address-card {
  margin: 1rem 0;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

button {
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

.edit-address-form {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.edit-address-form label {
  display: block;
  margin-bottom: 0.5rem;
}

.edit-address-form input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.edit-address-form button {
  background-color: #28a745;
}

.edit-address-form button[type="button"] {
  background-color: #dc3545;
}

.avatar-container {
  position: relative;
  width: 200px;
  margin: 20px 0;
}

.profile-avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ddd;
  image-rendering: crisp-edges;
  backface-visibility: hidden;
}

.avatar-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

input[type="file"] {
  display: none;
}

.password-change-form {
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.password-change-form label {
  display: block;
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.password-change-form input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  transition: border-color 0.2s;
}

.password-change-form input:focus {
  outline: none;
  border-color: #3b82f6;
  ring: 2px;
  ring-color: #3b82f6;
}



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