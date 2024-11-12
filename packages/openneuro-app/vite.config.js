import { defineConfig } from "vite"
import nodePolyfills from "rollup-plugin-polyfill-node"

/**
 * Vite plugin to hack a bug injected by the default assetImportMetaUrlPlugin
 */
function workaroundAssetImportMetaUrlPluginBug() {
  return {
    name: "vite-workaround-import-glob",
    transform(src, id) {
      if (
        id.includes("@bids_validator_main.js") ||
        id.includes("wasm_xml_parser.js")
      ) {
        const metaImport = /,.?import\.meta\.url/
        return src.replace(metaImport, "")
      } else {
        return null
      }
    },
  }
}

export default defineConfig({
  root: "src",
  server: {
    port: 80,
    host: "0.0.0.0",
    cors: true,
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      external: "/crn/config.js",
    },
  },
  optimizeDeps: {
    include: [
      "@apollo/client/react/components",
      "@apollo/client/link/schema",
      "@apollo/client/link/context",
      "@apollo/client/link/ws",
      "@apollo/client/utilities",
    ],
    exclude: ["stream-browserify"],
  },
  resolve: {
    alias: [
      // Workaround for `'request' is not exported by __vite-browser-external`
      {
        find: "./runtimeConfig",
        replacement: "./runtimeConfig.browser",
      },
      // Workaround for bids-validator -> hed-validator -> xml2js -> sax -> Stream shim
      { find: "stream", replacement: "stream-browserify" },
      // sax -> Buffer shim
      { find: "buffer", replacement: "buffer/" },
      // bids-validator deno buffer
      { find: "node:buffer", replacement: "buffer/" },
    ],
  },
  plugins: [workaroundAssetImportMetaUrlPluginBug(), nodePolyfills()],
})
