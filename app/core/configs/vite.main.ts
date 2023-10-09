import { join } from "path";
import { builtinModules } from "module";
import { defineConfig } from "vite";

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, "../src/main"),
  build: {
    outDir: "../../dist/main",
    lib: {
      entry: "index.ts",
      formats: ["cjs"],
    },
    sourcemap: false,
    minify: true,
    emptyOutDir: true,
    rollupOptions: {
      external: [...builtinModules, "electron", "workers"],
      output: {
        entryFileNames: "[name].cjs",
        chunkFileNames: "[name].cjs",
        manualChunks: (id: string) => {
          if (id.includes("css")) return "css";
          if (id.includes("ajv")) return "ajv";
          if (id.includes("electron")) return "electron";
          if (id.includes("atomically")) return "atomically";
          if (id.includes("chokidar")) return "chokidar";
        },
      },
    },
  },
});
