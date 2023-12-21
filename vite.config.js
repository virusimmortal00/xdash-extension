import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '',
  build: {
    outDir: path.resolve(__dirname, 'dist/xdash-extension-release'),
    cssCodeSplit: true, // Enable CSS code splitting
    rollupOptions: {
      input: {
        content: path.resolve(__dirname, 'src/content.ts'),
        popup: path.resolve(__dirname, 'src/popup.ts') // Assuming popup.ts is your source file for popup
      },
      output: {
        format: 'es', // Use ES module format
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: assetInfo => {
          if (assetInfo.name.endsWith('.css')) return 'css/[name][extname]';
          return '[name][extname]';
        },
      }
    },
  },
  publicDir: 'public',
  server: false
});
