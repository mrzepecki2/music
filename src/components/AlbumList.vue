<template>
  <div class="container mx-auto p-4">
    <div>
      <div v-if="albums.length === 0 && !loading" class="text-center text-xl">Nie znaleziono albumów</div>

      <div class="mb-4">
        <div class="flex flex-col md:flex-col lg:flex-row sm:gap-6">
          <div class="flex-1">
            <div class="relative">
              <input v-model="searchQuery" type="text" placeholder="Szukaj albumu..."
                class="w-full p-3 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500" />
              <button @click="resetQuery" v-if="searchQuery"
                class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200">
                <XMarkIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="sm:flex-1 hidden md:block mt-4 md:mt-0 sm:text-right">
            <div class="flex gap-2 justify-end">
              <GenreFilter :terms="terms" :selectedTerms="selectedTerms" @update:selectedTerms="updateSelectedTerms" />
              <SortFilter class="p-3"/>
              <GroupFilter class="p-3" />
            </div>
          </div>
        </div>


        <div class="md:hidden flex items-center gap-2">
          <button @click="toggleFilters"
            class="text-sm text-gray-600 hover:text-blue-500 focus:outline-none transition-all duration-200 flex items-center gap-1 px-2 py-1">
            Filtry
          </button>
        </div>

        <div v-if="filtersVisible" class="sm:hidden mt-4">
          <GenreFilter :terms="terms" :selectedTerms="selectedTerms" @update:selectedTerms="updateSelectedTerms" />
          <SortFilter class="mt-2 p-1" />
          <GroupFilter class="mt-2 p-1" />
        </div>
      </div>

      <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" v-if="loading">
        <li v-for="index in 4" :key="'skeleton-' + index"
          class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
          <div class="relative">
            <div class="w-full h-48 bg-gray-300"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-black opacity-50"></div>
          </div>
          <div class="p-4">
            <div class="w-3/4 h-6 bg-gray-300 mb-2"></div>
            <div class="w-1/2 h-4 bg-gray-300"></div>
          </div>
        </li>
      </ul>

      <div v-if="!loading">
        <template v-if="!groupBy">
          <transition-group name="fade-slide" tag="ul"
            class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" appear>
            <li v-for="album in filteredAlbums" :key="album.id.attributes['im:id']">
              <AlbumCard :album="album" />
            </li>
          </transition-group>
        </template>

        <template v-else>
          <div v-for="{ group, albums } in groupAlbums" :key="group">
            <h2 class="text-2xl font-bold my-4">{{ group }}</h2>
            <transition-group name="fade-slide" tag="ul"
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" appear>
              <li v-for="album in albums" :key="album.id.attributes['im:id']">
                <AlbumCard :album="album" />
              </li>
            </transition-group>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAlbumStore } from '@/stores/albumStore'
import { storeToRefs } from 'pinia'
import AlbumCard from '@/components/AlbumCard.vue'
import GenreFilter from '@/components/GenreFilter.vue'
import SortFilter from '@/components/SortFilter.vue'
import GroupFilter from '@/components/GroupFilter.vue'
import { XMarkIcon } from '@heroicons/vue/20/solid'

const albumStore = useAlbumStore()

const { resetQuery } = albumStore
const { loading, albums, searchQuery, filteredAlbums, terms, selectedTerms, groupAlbums, groupBy } = storeToRefs(albumStore)

const updateSelectedTerms = (terms: string[]) => {
  albumStore.selectedTerms = terms
}

onMounted(() => {
  albumStore.loadAlbums()
})

const filtersVisible = ref<boolean>(false)

const toggleFilters = () => {
  filtersVisible.value = !filtersVisible.value
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-move {
  transition: opacity 0.5s, transform 0.5s ease-out;
}

.fade-slide-leave-active {
  transition: opacity 0.4s, transform 0.4s ease-in;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
</style>
