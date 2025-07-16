import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync } from 'fs';

// Read package.json to get the package name
const packageJson = JSON.parse(readFileSync('./package-cube-parameters.json', 'utf-8'));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/cube-parameters.ts'),
      name: 'CubeParameters',
      formats: ['es', 'umd'],
      fileName: (format) => `cube-parameters.${format}.js`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
    cssCodeSplit: false,
    sourcemap: true,
  },
  css: {
    postcss: {
      plugins: [],
    },
  },
});