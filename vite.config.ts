import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ignore-enterprise-modules',
      resolveId(id) {
        if (id.startsWith('@c4-enterprise/')) {
          return { id, external: true };
        }
        return null;
      }
    }
  ],
  base: './',
  optimizeDeps: {
    exclude: ['@c4-enterprise/enterprise-context']
  }
})
