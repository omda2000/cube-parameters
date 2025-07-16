import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { resolve } from 'path';

// Library build configuration for NPM package
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'ModelViewer3D',
      formats: ['es', 'umd'],
      fileName: (format) => `model-viewer-3d.${format}.js`,
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime',
        },
        // Ensure CSS is extracted
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'model-viewer-3d.css';
          return assetInfo.name || '';
        },
      },
    },
    // Generate source maps for debugging
    sourcemap: true,
    // Optimize for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Ensure CSS is processed correctly
  css: {
    postcss: './postcss.config.js',
  },
});