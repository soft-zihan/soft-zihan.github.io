import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [vue()],
    // GitHub Pages usually deploys to /<repo-name>/, so base needs to be relative.
    base: './',
    define: {
      // Safer polyfill for the Google GenAI SDK usage in browser
      'process.env.API_KEY': JSON.stringify(env.API_KEY || '')
    },
    build: {
      outDir: 'dist',
    }
  };
});