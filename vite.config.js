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
      input: {
        main: 'index.html',
        '404': '404.html',
        'ai-voice-automation': 'ai-voice-automation.html',
        'enterprise-license-manager': 'enterprise-license-manager.html',
        'logistics-aggregator': 'logistics-aggregator.html',
        'myinterviewprep': 'myinterviewprep.html',
        'real-estate-analytics': 'real-estate-analytics.html',
        'supply-chain-management': 'supply-chain-management.html',
        'tourism-crm': 'tourism-crm.html',
        'under-construction': 'under-construction.html',
        'uniarr': 'uniarr.html',
      },
      output: {
        manualChunks: undefined,
      }
    }
  },
});
