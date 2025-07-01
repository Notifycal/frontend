import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react-swc';
import path from 'node:path';
import { normalizePath } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { defineConfig } from 'vitest/config';

import tsconfigPaths from 'vite-tsconfig-paths';

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
      react(),
      TanStackRouterVite(),
      viteStaticCopy({
        targets: [
          {
            src: normalizePath(path.resolve('./src/assets/locales')),
            dest: normalizePath(path.resolve('./dist'))
          }
        ]
      }),
      tsconfigPaths()
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
