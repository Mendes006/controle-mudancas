import { defineConfig } from 'vite';

// base './' (caminhos relativos) permite publicar o MESMO build em
// /controle-mudancas/staging/ e depois em /controle-mudancas/ sem recompilar.
export default defineConfig({
  base: './',
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: ['src/main.js'],
      thresholds: { lines: 80 },
    },
  },
});
