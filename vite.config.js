import { defineConfig } from 'vite';
import { visualizer } from "rollup-plugin-visualizer";
import path from 'path';

export default defineConfig({
  base: '',
  build: {
    outDir: path.resolve(__dirname, 'dist/xdash-extension-release'),
    cssCodeSplit: true, // Enable CSS code splitting
    rollupOptions: {
      input: {
        content: path.resolve(__dirname, 'src/content.ts'),
        popup: path.resolve(__dirname, 'src/popup.ts'), // Your popup TypeScript file
        background: path.resolve(__dirname, 'src/background.ts') // Your background TypeScript file
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
  server: false,
  plugins: [visualizer()],
});
