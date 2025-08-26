import { unpluginFonts } from '@notifycal/shared/theme';
import { bundleSizePlugin, ourServiceConfigPlugin } from '@notifycal/shared/utils';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import Unfonts from 'unplugin-fonts/vite';
import { normalizePath } from 'vite';
import { plugin as markdown, Mode } from 'vite-plugin-markdown';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

const maxBundleChunkSizeInBytes = 1.5 * 1024 * 1024; //MB
const maxTotalBundleSizeInBytes = 2.05 * 1024 * 1024; //MB

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    Unfonts({
      google: {
        families: unpluginFonts
      }
    }),
    markdown({ mode: [Mode.HTML] }),
    tanstackRouter({
      target: 'react'
    }),
    react(),
    svgr(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve('./src/assets/locales')),
          dest: normalizePath(path.resolve('./dist'))
        }
      ]
    }),
    tsconfigPaths(),
    ourServiceConfigPlugin(__dirname)
  ],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: (maxBundleChunkSizeInBytes / 1024) * 0.9, // Expressed in KB. The budget is 90% of the limit.
    rollupOptions: {
      plugins: [bundleSizePlugin(maxBundleChunkSizeInBytes, maxTotalBundleSizeInBytes)]
    }
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173
  },
  preview: {
    port: 5173
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    css: true,
    passWithNoTests: true
  }
});
