import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/kmas": {
        target: "https://www.kmas.or.kr",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/kmas/, ""),
      },
    },
  },
});