import { defineConfig } from 'vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import { nitro } from 'nitro/vite'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    nitro({
      preset: 'cloudflare-module',
      prerender: {
        concurrency: 1,
        routes: [
          '/',
          '/listings',
          '/listings/l1',
          '/listings/l2',
          '/listings/l3',
          '/listings/l4',
          '/listings/l5',
          '/listings/l6',
          '/listings/l7',
          '/listings/l8',
          '/listings/l9',
          '/listings/l10',
          '/listings/l11',
          '/listings/l12',
          '/get-started',
          '/neighborhoods',
          '/events',
        ],
      },
      rollupConfig: { external: [/^@sentry\//] },
    }),

    tanstackStart(),
    viteReact(),
    tailwindcss(),
  ],
})

export default config
