import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@components': path.resolve(__dirname, './src/components'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@data': path.resolve(__dirname, './src/data'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@icons': path.resolve(__dirname, './src/icons'),
      '@locales': path.resolve(__dirname, './src/locales'),
      '@store': path.resolve(__dirname, './src/store'),
      '@interfaces': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@plugins': path.resolve(__dirname, './src/plugins'),
      '@slots': path.resolve(__dirname, './src/slots')
    },
  },
})
