<template>
  <div
    class="bg-black text-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:scale-105 h-full group">
    <div class="relative overflow-hidden">
      <img :src="album['im:image'][2].label" alt="Album cover"
        class="w-full h-72 object-cover transition-all duration-300 group-hover:scale-105 group-hover:blur-0.5" />
      <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>

      <div class="absolute top-4 left-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">

        <svg @click="toggleLike(album.id.label)" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
          viewBox="0 0 24 24" stroke="currentColor" class="w-6 h-6" :class="{ 'text-yellow-500': isLiked }">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 17.75l-6.3 3.3 1.6-7-5.8-5.1 7.6-.6L12 2l2.9 6.8 7.6.6-5.8 5.1 1.6 7-6.3-3.3z" />
        </svg>

      </div>

      <a :href="album.link.attributes.href" target="_blank"
        class="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none" stroke="#5C5F62"
          class="w-6 h-6">
          <path fill="black" stroke="none"
            d="M8 3.517a1 1 0 011.62-.784l5.348 4.233a1 1 0 010 1.568l-5.347 4.233A1 1 0 018 11.983v-1.545c-.76-.043-1.484.003-2.254.218-.994.279-2.118.857-3.506 1.99a.993.993 0 01-1.129.096.962.962 0 01-.445-1.099c.415-1.5 1.425-3.141 2.808-4.412C4.69 6.114 6.244 5.241 8 5.042V3.517zm1.5 1.034v1.2a.75.75 0 01-.75.75c-1.586 0-3.066.738-4.261 1.835a8.996 8.996 0 00-1.635 2.014c.878-.552 1.695-.916 2.488-1.138 1.247-.35 2.377-.33 3.49-.207a.75.75 0 01.668.745v1.2l4.042-3.2L9.5 4.55z" />
        </svg>
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

const props = defineProps({
  album: Object as Album
})

const albumStore = useAlbumStore()

const isLiked = computed(() => albumStore.isLiked(props.album.id.label))

const toggleLike = (albumId: string) => {
  albumStore.toggleLike(albumId)
}
</script>