import { vi, describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAlbumStore } from '@/stores/albumStore'
import { SortBy, GroupBy } from '@/types/enums'
import type { Album } from '@/types/album'

describe('albumStore', () => {
  let store: ReturnType<typeof useAlbumStore>

  const mockAlbums = [
    { 'im:name': { label: 'Test Album 1' }, 'im:artist': { label: 'Artist 1' }, id: { label: '1' }, category: { attributes: { term: 'Pop' } }, 'im:price': { attributes: { amount: '10.99' } } },
    { 'im:name': { label: 'Test Album 2' }, 'im:artist': { label: 'Artist 2' }, id: { label: '2' }, category: { attributes: { term: 'Rock' } }, 'im:price': { attributes: { amount: '5.99' } } },
    { 'im:name': { label: 'Test Album 3' }, 'im:artist': { label: 'Artist 1' }, id: { label: '3' }, category: { attributes: { term: 'Pop' } }, 'im:price': { attributes: { amount: '7.99' } } },
    { 'im:name': { label: 'Test Album 4' }, 'im:artist': { label: 'Artist 2' }, id: { label: '4' }, category: { attributes: { term: 'Jazz' } }, 'im:price': { attributes: { amount: '12.99' } } },
    { 'im:name': { label: 'Test Album 5' }, 'im:artist': { label: 'Artist 3' }, id: { label: '5' }, category: { attributes: { term: 'Pop' } }, 'im:price': { attributes: { amount: '4.99' } } }
  ]

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useAlbumStore()
    store.albums = [...mockAlbums]
  })

  const mockFetch = (response: any) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => response
    }))
  }

  it('loads albums successfully and updates the albums list', async () => {
    mockFetch({ feed: { entry: [{ id: { label: '1' }, 'im:name': { label: 'Test Album' } }] } })

    await store.loadAlbums()

    expect(store.albums.length).toBeGreaterThan(0)
    expect(store.albums[0]['im:name'].label).toBe('Test Album')
  })

  it('sets error message when loading albums fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')))

    await store.loadAlbums()

    expect(store.error).toBe('Failed to fetch')
  })

  it('toggles the like status for an album', () => {
    store.toggleLike('1')
    expect(store.likedAlbumIds).toContain('1')

    store.toggleLike('1')
    expect(store.likedAlbumIds).not.toContain('1')
  })

  it('returns true if the album is liked', () => {
    store.toggleLike('1')

    expect(store.isLiked('1')).toBe(true)
  })

  it('returns false if the album is not liked', () => {
    expect(store.isLiked('1')).toBe(false)
  })

  it('filters albums based on the search query', () => {
    store.searchQuery = 'Test Album 1'

    const filtered = store.filteredAlbums

    expect(filtered.length).toBe(1)
    expect(filtered[0]['im:name'].label).toBe('Test Album 1')
  })

  it('filters albums based on selected genres', () => {
    store.selectedTerms = ['Pop']

    const filtered = store.filteredAlbums

    expect(filtered.length).toBe(3)
    expect(filtered[0]['im:name'].label).toBe('Test Album 1')
    expect(filtered[1]['im:name'].label).toBe('Test Album 3')
    expect(filtered[2]['im:name'].label).toBe('Test Album 5')
  })

  it('sorts albums by price in ascending order (PRICE_ASC)', () => {
    store.sortBy = SortBy.PRICE_ASC

    const sorted = store.filteredAlbums

    expect(sorted[0]['im:name'].label).toBe('Test Album 5')
    expect(sorted[1]['im:name'].label).toBe('Test Album 2')
    expect(sorted[2]['im:name'].label).toBe('Test Album 3')
    expect(sorted[3]['im:name'].label).toBe('Test Album 1')
    expect(sorted[4]['im:name'].label).toBe('Test Album 4')
  })

  it('calculates unique genres (terms) correctly', () => {
    const terms = store.terms

    expect(terms).toEqual(['Pop', 'Rock', 'Jazz'])
  })

  it('groups albums by genre correctly', () => {
    store.groupBy = GroupBy.GENRE

    const grouped = store.groupAlbums

    expect(grouped.length).toBe(3)
    expect(grouped[0].group).toBe('Pop')
    expect(grouped[1].group).toBe('Rock')
    expect(grouped[2].group).toBe('Jazz')
  })

  it('groups albums by artist correctly', () => {
    store.groupBy = GroupBy.ARTIST

    const grouped = store.groupAlbums

    expect(grouped.length).toBe(3)
    expect(grouped[0].group).toBe('Artist 1')
    expect(grouped[1].group).toBe('Artist 2')
    expect(grouped[2].group).toBe('Artist 3')
  })

  it('groups albums by price range correctly', () => {
    store.groupBy = GroupBy.PRICE_RANGE
  
    const grouped = store.groupAlbums
  
    const priceRanges = grouped.map((group: Record<string, Album[]>) => group.group)
  
    expect(priceRanges).toEqual(expect.arrayContaining(['0-5$', '5-10$', '10$+']))
  })
})
