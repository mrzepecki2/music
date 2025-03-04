<template>
  <div class="container mx-auto p-4">
    <div>
      <div v-if="albums.length === 0 && !loading" class="text-center text-xl">Nie znaleziono atrybutów</div>

      <div class="flex mb-4 space-x-4">
        <div class="flex-1">
          <input v-model="searchQuery" type="text" placeholder="Search for albums..."
            class="w-full p-3 rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500" />
        </div>

        <GenreFilter :terms="terms" :selectedTerms="selectedTerms" @update:selectedTerms="updateSelectedTerms" />

        <SortFilter />
      </div>

      <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <li v-for="index in 4" :key="'skeleton-' + index" v-if="loading"
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

        <li v-for="album in filteredAlbums" :key="album.id.attributes['im:id']">
          <AlbumCard :album="album" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAlbumStore } from '@/stores/albumStore'
import { storeToRefs } from 'pinia'
import AlbumCard from '@/components/AlbumCard.vue'
import GenreFilter from '@/components/GenreFilter.vue'
import SortFilter from '@/components/SortFilter.vue'

const albumStore = useAlbumStore()


const { loading, albums, searchQuery, filteredAlbums, terms, selectedTerms } = storeToRefs(albumStore)

const updateSelectedTerms = (terms: string[]) => {
  albumStore.selectedTerms = terms
}

onMounted(() => {
  albumStore.loadAlbums()
})
</script>
