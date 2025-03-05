<template>
  <select v-model="sortBy"
    class="rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
    <option :value="SortBy.POPULAR">Od najpopularniejszych</option>
    <option :value="SortBy.NEWEST">Od najnowszych</option>
    <option :value="SortBy.OLDEST">Od najstarszych</option>
    <option :value="SortBy.PRICE_ASC">Cena: od najtańszych</option>
    <option :value="SortBy.PRICE_DESC">Cena: od najdroższych</option>
    <option :value="SortBy.LIKED">Ulubione</option>
  </select>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAlbumStore } from '@/stores/albumStore'
import { SortBy } from '@/types/enums'

const albumStore = useAlbumStore()
const { sortBy } = storeToRefs(albumStore)
</script>
