import { mount } from '@vue/test-utils';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AlbumCard from '@/components/AlbumCard.vue';
import { createPinia, setActivePinia } from 'pinia';
import { useAlbumStore } from '@/stores/albumStore';

describe('AlbumCard.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  const mockAlbum = {
    id: { label: '1', attributes: { 'im:id': '1' } },
    'im:name': { label: 'Test Album' },
    'im:artist': { label: 'Test Artist' },
    'im:image': [{}, {}, { label: 'test-image.jpg' }],
    'im:price': { label: '$9.99' },
    link: { attributes: { href: 'https://example.com' } },
  };

  it('renders album details correctly', () => {
    const wrapper = mount(AlbumCard, {
      props: { album: mockAlbum },
    });

    expect(wrapper.text()).toContain('Test Album');
    expect(wrapper.text()).toContain('Test Artist');
    expect(wrapper.find('img').attributes('src')).toBe('test-image.jpg');
  });

  it('toggles like status on click', async () => {
    const store = useAlbumStore();
    const wrapper = mount(AlbumCard, { props: { album: mockAlbum } });

    await wrapper.find('svg').trigger('click');
    expect(store.isLiked('1')).toBe(true);

    await wrapper.find('svg').trigger('click');
    expect(store.isLiked('1')).toBe(false);
  })
});
