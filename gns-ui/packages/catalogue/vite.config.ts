import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// `@gns/ui` resolves through the workspace symlink to its TypeScript source,
// so component edits hot-reload here with no build step in between.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "./",
  server: {
    port: 5180,
    strictPort: true,
  },
  build: {
    outDir: "dist",
    // The client runs CEF 128; there is no reason to ship ES5 helpers.
    target: "chrome128",
  },
});
