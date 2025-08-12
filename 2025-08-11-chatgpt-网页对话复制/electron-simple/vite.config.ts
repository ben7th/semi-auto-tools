import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      output: {
        entryFileNames: "renderer/[name].js",
        chunkFileNames: "renderer/[name].js",
        assetFileNames: "renderer/[name].[ext]"
      }
    }
  }
});
