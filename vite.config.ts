import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
      'react-native-safe-area-context': 'react-native-safe-area-context/src/index.tsx',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react-native'],
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      external: ['react-native-maps'],
    },
  },
  define: {
    global: 'globalThis',
  },
});
