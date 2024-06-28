import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({ include: "**/*.svg", exclude: "**/images/**/*.svg" }),
    // eslint-disable-next-line no-undef
    ...(process.env.USE_HTTPS === "true"
      ? [await import("vite-plugin-mkcert").then((plugin) => plugin.default())]
      : []),
  ],
});
