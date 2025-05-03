import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@c4-enterprise/account-menu': path.resolve(__dirname, '../c4_enterprise/libs/account-menu/src/index.ts')
    }
  }
})
