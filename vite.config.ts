import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';


export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  // Convert VITE_ variables to process.env and avoid jest errors
  const processEnv = Object.keys(env)
    .filter((key) => key.startsWith("VITE_"))
    .reduce((acc, key) => {
      const newKey = key.replace(/^VITE_/, "");
      acc[`process.env.${newKey}`] = JSON.stringify(env[key]);
      return acc;
    }, {} as Record<string, string>);

  return {
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
        '@slots': path.resolve(__dirname, './src/slots'),
        '@theme': path.resolve(__dirname, './src/theme'),
      },
    },
    define: processEnv,
  }
})