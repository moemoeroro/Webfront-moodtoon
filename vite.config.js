import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
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
