import { vi, describe, it, expect, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAlbumStore } from '@/stores/albumStore';
import { SortBy } from '@/types/enums';

describe('albumStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('loads albums successfully and updates the albums list', async () => {
    const store = useAlbumStore();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: () => ({ feed: { entry: [{ id: { label: '1' }, 'im:name': { label: 'Test Album' } }] } })
    }));

    await store.loadAlbums();

    expect(store.albums.length).toBeGreaterThan(0);
    expect(store.albums[0]['im:name'].label).toBe('Test Album');
  });

  it('sets error message when loading albums fails', async () => {
    const store = useAlbumStore();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Failed to fetch')));

    await store.loadAlbums();

    expect(store.error).toBe('Failed to fetch');
  });

  it('toggles the like status for an album', () => {
    const store = useAlbumStore();
    
    store.toggleLike('1');
    expect(store.likedAlbumIds).toContain('1');
    
    store.toggleLike('1');
    expect(store.likedAlbumIds).not.toContain('1');
  });

  it('returns true if the album is liked', () => {
    const store = useAlbumStore();
    
    store.toggleLike('1');
    
    expect(store.isLiked('1')).toBe(true);
  });

  it('returns false if the album is not liked', () => {
    const store = useAlbumStore();
    
    expect(store.isLiked('1')).toBe(false);
  });

  it('filters albums based on the search query', () => {
    const store = useAlbumStore();
    store.albums = [
      { 'im:name': { label: 'Test Album 1' }, id: { label: '1' } },
      { 'im:name': { label: 'Test Album 2' }, id: { label: '2' } }
    ];
    store.searchQuery = 'Test Album 1';
    
    const filtered = store.filteredAlbums;
    
    expect(filtered.length).toBe(1);
    expect(filtered[0]['im:name'].label).toBe('Test Album 1');
  });

  it('filters albums based on selected genres', () => {
    const store = useAlbumStore();
    store.albums = [
      { 'im:name': { label: 'Test Album 1' }, category: { attributes: { term: 'Pop' } }, id: { label: '1' } },
      { 'im:name': { label: 'Test Album 2' }, category: { attributes: { term: 'Rock' } }, id: { label: '2' } }
    ];
    store.selectedTerms = ['Pop'];

    const filtered = store.filteredAlbums;

    expect(filtered.length).toBe(1);
    expect(filtered[0]['im:name'].label).toBe('Test Album 1');
  });

  it('sorts albums by price in ascending order (PRICE_ASC)', () => {
    const store = useAlbumStore();
    store.albums = [
      { 'im:name': { label: 'Test Album 1' }, 'im:price': { attributes: { amount: '10.99' } }, id: { label: '1' } },
      { 'im:name': { label: 'Test Album 2' }, 'im:price': { attributes: { amount: '5.99' } }, id: { label: '2' } }
    ];
    store.sortBy = SortBy.PRICE_ASC;

    const sorted = store.filteredAlbums;

    expect(sorted[0]['im:name'].label).toBe('Test Album 2');
    expect(sorted[1]['im:name'].label).toBe('Test Album 1');
  });

  it('calculates unique genres (terms) correctly', () => {
    const store = useAlbumStore();
    store.albums = [
      { 'im:name': { label: 'Test Album 1' }, category: { attributes: { term: 'Pop' } }, id: { label: '1' } },
      { 'im:name': { label: 'Test Album 2' }, category: { attributes: { term: 'Rock' } }, id: { label: '2' } },
      { 'im:name': { label: 'Test Album 3' }, category: { attributes: { term: 'Pop' } }, id: { label: '3' } }
    ];

    const terms = store.terms;

    expect(terms).toEqual(['Pop', 'Rock']);
  });
});
