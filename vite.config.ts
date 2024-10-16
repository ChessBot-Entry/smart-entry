import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import package_json from './package.json'
import babel from 'vite-plugin-babel'
import react from '@vitejs/plugin-react'

manifest.version = package_json.version

export default defineConfig({
  plugins: [react(), crx({ manifest }), babel()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      },
      mangle: false
    }
  }
})