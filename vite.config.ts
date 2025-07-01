import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import fs from 'node:fs';
import { normalizePath } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';

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
export default defineConfig(({ command, mode }) => {
  const isLocalDev = mode !== 'production' && command === 'serve';

  const resolveDev = {
    alias: {
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs'
    }
  };

  return {
    plugins: [
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
    resolve: isLocalDev ? resolveDev : {},
    server: {
      host: true,
      strictPort: true,
      port: 5173
    },
    preview: {
      port: 5173
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      css: true,
      passWithNoTests: true
    }
  };
});
