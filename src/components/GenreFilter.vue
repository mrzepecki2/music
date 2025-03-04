<template>
  <div class="relative h-full">
    <button
      @click="toggleDropdown"
      class="w-full sm:w-auto h-12 p-3 text-left rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
    >
      <span class="sm:hidden">Filtruj</span>
      <span class="hidden sm:inline-block">
        <CogIcon class="w-5 h-5" />
      </span>
    </button>

    <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-gray-300 rounded-lg shadow-md z-10">
      <div class="p-4 max-h-60 overflow-y-auto">
        <div v-for="term in terms" :key="term" class="flex items-center space-x-2">
          <input
            type="checkbox"
            :id="term"
            :value="term"
            v-model="selectedTerms"
            class="h-4 w-4 text-blue-500 border-gray-300 rounded"
          />
          <label :for="term" class="text-sm text-gray-700 whitespace-nowrap">{{ term }}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAlbumStore } from '@/stores/albumStore'
import { storeToRefs } from 'pinia'
import { CogIcon } from '@heroicons/vue/20/solid'

const albumStore = useAlbumStore()
const { terms, selectedTerms } = storeToRefs(albumStore)

const dropdownOpen = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}
</script>
