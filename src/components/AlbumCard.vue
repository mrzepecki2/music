<template>
  <div
    class="bg-black text-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:scale-105 h-full group">
    <div class="relative overflow-hidden">
      <img :src="album['im:image'][2].label" alt="Album cover"
        class="w-full h-72 object-cover transition-all duration-300 group-hover:scale-105 group-hover:blur-0.5" />
      <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>

      <div class="absolute top-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <HeartIcon
          @click="toggleLike(album.id.label)"
          class="w-6 h-6 cursor-pointer"
          :class="{ 'text-yellow-500': isLiked, 'fill-current': isLiked }"
          :fill="isLiked ? 'currentColor' : 'none'"
        />
      </div>

      <a :href="album.link.attributes.href" target="_blank"
        class="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <ArrowRightCircleIcon class="w-6 h-6" />
      </a>

      <div
        class="absolute bottom-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <p class="text-sm bg-black p-2 rounded-full">{{ album['im:price'].label }}</p>
      </div>
    </div>

    <div class="p-4">
      <h3 class="text-lg font-semibold truncate">{{ album['im:name'].label }}</h3>
      <p class="text-sm text-gray-400 mt-1 truncate">{{ album['im:artist'].label }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAlbumStore } from '@/stores/albumStore'
import type { Album } from '@/types/album'

import { HeartIcon, ArrowRightCircleIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  album: Object as Album
})

const albumStore = useAlbumStore()

const isLiked = computed(() => albumStore.isLiked(props.album.id.label))

const toggleLike = (albumId: string) => {
  albumStore.toggleLike(albumId)
}
</script>
