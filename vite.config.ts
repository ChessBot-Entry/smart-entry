import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'
import package_json from './package.json'
import babel from 'vite-plugin-babel'

manifest.version = package_json.version

export default defineConfig({
  plugins: [crx({ manifest }), babel()],
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