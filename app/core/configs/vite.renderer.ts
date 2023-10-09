import { defineConfig } from "vite";
import { join } from "path";
import react from "@vitejs/plugin-react";

export default defineConfig({
  mode: process.env.NODE_ENV,
  root: join(__dirname, "../src/renderer"),
  plugins: [react()],
  base: "./",
  build: {
    emptyOutDir: true,
    outDir: "../../dist/renderer",
    sourcemap: false,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          const icons = /icons/gi;
          const toast = /toast/gi;
          const react_router = /react-router/gi;
          const markdown = /markdown|remark|rehype/gi;
          const monaco = /monaco/gi;
          const spinners = /spinners/gi;
          const virtualized = /virtualized|window|zoom/gi;
          const styled_components = /styled-components/gi;

          if (markdown.test(id)) return "markdown";
          if (monaco.test(id)) return "monaco";
          if (styled_components.test(id)) return "styled-components";
          if (react_router.test(id)) return "react-router";
          if (virtualized.test(id)) return "virtualized";
          if (toast.test(id)) return "toast";
          if (spinners.test(id)) return "spinners";
          if (icons.test(id)) return "icons";
        },
      },
    },
  },
  resolve: {
    alias: {
      src: join(__dirname, "../src"),
    },
  },
  server: {
    host: "localhost",
    port: 3344,
  },
});
