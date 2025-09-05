import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('html2canvas')) return 'html2canvas';
            if (id.includes('apexcharts')) return 'apexcharts';
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendors';
            if (id.includes('react-router-dom')) return 'router';
            if (id.includes('axios')) return 'axios';
            if (id.includes('xlsx')) return 'xlsx';
            return 'vendor';
          }
        }
      }
    }
  }
})
