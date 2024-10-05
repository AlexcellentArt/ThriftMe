import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build:{
    outDir: 'dist',
  },
  //For future reference, use this structure so that you don't need to rewrite routes
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: process.env.VITE_API_URL,
  //       changeOrigin: true,
  //       secure: false,
  //     }
  //   }
  // }
});
