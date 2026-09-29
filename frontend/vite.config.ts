import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "./src") },
  },
  server: {
    port: 5179,
    // /api calls go to the backend. In Docker the backend is at http://backend:4000.
    proxy: {
      "/api": { target: process.env.API_PROXY_TARGET ?? "http://localhost:4000", changeOrigin: true },
    },
  },
});
