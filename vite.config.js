import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // Inline small assets as data URLs (< 4KB)
    assetsInlineLimit: 4096,
    // Enable CSS minification
    cssMinify: 'lightningcss',
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: undefined,
      }
    }
  },
});
