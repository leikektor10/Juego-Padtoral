import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// base relativa: el build funciona en cualquier subcarpeta o servidor estático.
export default defineConfig({
  base: './',
  plugins: [react()],
  test: {
    environment: 'node',
  },
});
