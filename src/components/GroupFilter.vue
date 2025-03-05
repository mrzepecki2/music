<template>
  <select v-model="groupBy"
    class="rounded-md border border-gray-300 shadow-md focus:ring-2 focus:ring-blue-500 w-full sm:w-auto">
    <option :value="null">Brak grupowania</option>
    <option :value="GroupBy.GENRE">Gatunek</option>
    <option :value="GroupBy.ARTIST">Artysta</option>
    <option :value="GroupBy.PRICE_RANGE">Przedział cenowy</option>
  </select>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useAlbumStore } from '@/stores/albumStore'
import { GroupBy } from '@/types/enums'

const albumStore = useAlbumStore()
const { groupBy } = storeToRefs(albumStore)
</script>
