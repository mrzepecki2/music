import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Ustawienie aliasu @ na katalog src
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});