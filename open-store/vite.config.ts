/// <reference types='vitest' />
import react from '@vitejs/plugin-react';
import * as path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: __dirname,
  cacheDir: '../node_modules/.vite/open-store',
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [react()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8',
    },
  },
  resolve: {
    alias: {
      '@monorepo-demo/core': path.resolve(__dirname, '../core/src/index.ts'),
      '@monorepo-demo/hooks': path.resolve(__dirname, '../hooks/src/index.ts'),
      '@monorepo-demo/utilities': path.resolve(
        __dirname,
        '../utilities/src/index.ts'
      ),
      '@monorepo-demo/design-system': path.resolve(
        __dirname,
        '../design-system/src/index.ts'
      ),
    },
  },
});
