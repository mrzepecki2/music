import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Album } from '@/types/album'
import { SortBy } from '@/types/enums'

export const useAlbumStore = defineStore('albumStore', () => {
  const albums = ref<Album[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const searchQuery = ref('')
  const selectedTerms = ref<string[]>([])
  const sortBy = ref<SortBy>(SortBy.POPULAR)
  const likedAlbumIds = ref<string[]>([])

  const loadAlbums = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await fetch('https://itunes.apple.com/us/rss/topalbums/limit=100/json')
      if (!response.ok) throw new Error('Failed to fetch albums')
      const data = await response.json()
      albums.value = data.feed.entry
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Something went wrong'
    } finally {
      loading.value = false
    }
  }


  const terms = computed<string[]>(() => {
    const uniqueTerms = new Set<string>()
    albums.value.forEach((album: Album) => {
      if (album.category?.attributes?.term) uniqueTerms.add(album.category.attributes.term)
    })
    return Array.from(uniqueTerms)
  })

  const filteredAlbums = computed<Album[]>(() => {
    return albums.value
      .filter((album: Album) => {
        const matchesSearch = album['im:name'].label.toLowerCase().includes(searchQuery.value.toLowerCase())
        const matchesGenres = selectedTerms.value.length === 0 || selectedTerms.value.includes(album.category?.attributes?.term)
        return matchesSearch && matchesGenres
      })
      .sort((a: Album, b: Album) => {
        switch (sortBy.value) {
          case SortBy.NEWEST:
            return new Date(b['im:releaseDate'].label).getTime() - new Date(a['im:releaseDate'].label).getTime()
          case SortBy.OLDEST:
            return new Date(a['im:releaseDate'].label).getTime() - new Date(b['im:releaseDate'].label).getTime()
          case SortBy.PRICE_ASC:
            return parseFloat(a['im:price'].attributes.amount) - parseFloat(b['im:price'].attributes.amount)
          case SortBy.PRICE_DESC:
            return parseFloat(b['im:price'].attributes.amount) - parseFloat(a['im:price'].attributes.amount)
          case SortBy.LIKED:
            const isALiked = likedAlbumIds.value.includes(a.id.label)
            const isBLiked = likedAlbumIds.value.includes(b.id.label)
            return isBLiked ? 1 : isALiked ? -1 : 0
          case SortBy.POPULAR:
          default:
            return 0
        }
      })
  })


  const toggleLike = (albumId: string): void => {
    const index = likedAlbumIds.value.indexOf(albumId)
    if (index === -1) {
      likedAlbumIds.value.push(albumId)
    } else {
      likedAlbumIds.value.splice(index, 1)
    }
  }

  const isLiked = computed(() => {
    return (albumId: string) => likedAlbumIds.value.includes(albumId)
  })

  const resetQuery = (): void => {
    console.log('ssssss')
    searchQuery.value = ''
  }

  return {
    albums,
    loading,
    error,
    searchQuery,
    selectedTerms,
    sortBy,
    terms,
    loadAlbums,
    filteredAlbums,
    likedAlbumIds,
    toggleLike,
    isLiked,
    resetQuery,
  }
}, {
  persist: {
    storage: localStorage,
    pick: ['likedAlbumIds', 'selectedTerms', 'likedAlbumIds'],
  },
})
