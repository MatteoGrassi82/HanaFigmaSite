import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Build config for the standalone HANA Sleep landing page (deployed as its own
// Vercel project). Same plugins/aliases as vite.config.ts, but the single entry
// is sleep.html and the output goes to dist-sleep/ so it never mixes with the
// main site build.
function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [figmaAssetResolver(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  build: {
    outDir: 'dist-sleep',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'sleep.html'),
    },
  },
})
