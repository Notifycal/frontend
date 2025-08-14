import { bundleSizePlugin } from '@notifycal/shared/utils';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import fs from 'node:fs';
import path from 'node:path';
import { normalizePath } from 'vite';
import { plugin as markdown, Mode } from 'vite-plugin-markdown';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';
const maxBundleChunkSizeInBytes = 1.4 * 1024 * 1024; //MB
const maxTotalBundleSizeInBytes = 2 * 1024 * 1024; //MB

const handleServiceConfigPlugin = (): import('vite').Plugin => {
  const pluginName = 'service-config-handler';
  const configLocalPath = path.resolve(__dirname, 'config/config.local.js');
  const configSkelPath = path.resolve(__dirname, 'config/config.skel.js');

  return {
    name: pluginName,
    configureServer: (server) => {
      // Only runs for the dev server
      console.log(`[${pluginName}] Serving local config.js...`);
      server.middlewares.use('/config.js', (req, res) => {
        const content = fs.readFileSync(configLocalPath, 'utf-8');
        res.setHeader('Content-Type', 'application/javascript');
        res.statusCode = 200;
        res.end(content);
      });
    },
    generateBundle() {
      // Only runs for the prod build
      console.log(`[${pluginName}] Bundling config.skel.js...`);
      const content = fs.readFileSync(configSkelPath, 'utf-8');
      this.emitFile({
        type: 'asset',
        fileName: 'config.skel.js',
        source: content
      });
      console.log(`[${pluginName}] Emitted config.skel.js to bundle.`);
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    markdown({ mode: [Mode.HTML] }),
    tanstackRouter({
      target: 'react'
    }),
    react(),
    viteStaticCopy({
      targets: [
        {
          src: normalizePath(path.resolve('./src/assets/locales')),
          dest: normalizePath(path.resolve('./dist'))
        }
      ]
    }),
    tsconfigPaths(),
    handleServiceConfigPlugin()
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
