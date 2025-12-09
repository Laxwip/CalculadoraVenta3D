import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from "vite-plugin-svgr";
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    port: 5173,
    host: true,
    //° Configura el proxy para redirigir solicitudes /api al servidor backend en localhost:3000
    // proxy: {
    //   '/api': 'http://localhost:3000'
    // }
  },
//comentario
  base: "./",
  build: {
   outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  }
})