import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  vite: {
    base: "/infotelcom-learning-hub/",
    server: { port: 5173, open: true },
  },
});