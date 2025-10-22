import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: [
      // react-syntax-highlighter (ESM Prism) deep-imports old subpaths; map to exported paths
      { find: /^refractor\/lib\/all$/, replacement: 'refractor/all' },
      { find: /^refractor\/lib\/core$/, replacement: 'refractor/core' },
      // Map dynamic imports like `refractor/lang/abap.js` -> `refractor/abap` (matches package exports)
      { find: /^refractor\/lang\/(.*)\.js$/, replacement: 'refractor/$1' },
    ],
  },
  optimizeDeps: {
    include: [
      'react-syntax-highlighter',
      'react-syntax-highlighter/dist/esm/styles/prism',
    ],
  },
})
