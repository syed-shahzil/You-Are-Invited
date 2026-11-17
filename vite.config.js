import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Relative base ('./') makes every asset path work on GitHub Pages
// (user.github.io/<repo>/) and on any other static host or sub-folder.
// Override with VITE_BASE=/repo-name/ if you prefer absolute paths.
export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE || './',
  plugins: [react(), ...(mode === 'single' ? [viteSingleFile()] : [])],
  build:
    mode === 'single'
      ? { outDir: 'dist-single', copyPublicDir: false, assetsInlineLimit: 100000000 }
      : {
          outDir: 'dist',
          // Embed the music (.m4a) directly inside the JavaScript so playback never depends on
          // a separate file request (no wrong paths, 404s, MIME or caching problems).
          assetsInlineLimit: (file) => (file.endsWith('.m4a') ? true : undefined)
        }
}))
