import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Vite marks generated `<script>` and `<link>` tags `crossorigin`, which makes
 * the embedded browser apply CORS rules to files it is loading straight off
 * disk. Stripping the attribute costs nothing and removes a whole class of
 * "blank WebUI, no error" failures in the client.
 */
function stripCrossorigin() {
  return {
    name: "gns-strip-crossorigin",
    enforce: "post" as const,
    transformIndexHtml(html: string) {
      return html.replace(/\s+crossorigin(=("|')[^"']*\2)?/g, "");
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), stripCrossorigin()],
  // CEF loads the page from a package-relative path; absolute asset URLs
  // would resolve against the wrong root.
  base: "./",
  server: {
    port: 5181,
    strictPort: true,
  },
  build: {
    // Output lands inside the HELIX package rather than next to the sources,
    // so the package stays self-contained and loads everything from disk.
    outDir: "../../../gns-ui-harness/html/build",
    // Required because the directory sits outside this project root.
    emptyOutDir: true,
    target: "chrome128",
    // One file each — the client has no HTTP cache to benefit from splitting.
    cssCodeSplit: false,
  },
});
