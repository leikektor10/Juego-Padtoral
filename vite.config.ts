import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base relativa: el build funciona en cualquier subcarpeta o servidor estático.
// Modo «single» (npm run build:web): todo en un único HTML con las imágenes incrustadas.
export default defineConfig(({ mode }) => ({
  base: './',
  plugins: [react()],
  resolve:
    mode === 'single'
      ? { alias: [{ find: /^(.*)\/inlineMedia$/, replacement: '$1/inlineMedia.single' }] }
      : undefined,
  build:
    mode === 'single'
      ? { outDir: 'dist-web', assetsInlineLimit: 100_000_000, cssCodeSplit: false, modulePreload: false, copyPublicDir: false }
      : undefined,
  test: {
    environment: 'node',
  },
}));
