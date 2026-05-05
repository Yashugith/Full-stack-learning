// vite.config.js
// Vite is our build tool — it runs the dev server and bundles the app for production
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()], // enables JSX support via React plugin
})
