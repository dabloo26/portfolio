import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/** For GitHub Pages project sites use e.g. `VITE_BASE=/repo-name/` in the build env. */
const base = process.env.VITE_BASE ?? "/";

export default defineConfig({
  plugins: [react()],
  base,
  /** Reduce “stuck on old bundle” during local dev (browser + prebundle cache). */
  server: {
    headers: {
      "Cache-Control": "no-store",
    },
  },
  build: {
    /** Avoid shipping readable TS source in production browser devtools. */
    sourcemap: false,
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three")) return "three";
          if (id.includes("node_modules/@react-three")) return "r3f";
        },
      },
    },
  },
});
