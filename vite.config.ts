// vite.config.ts
import { defineConfig } from "vitest/config"

const nodeMajorVersion = parseInt(process.versions.node.split(".")[0], 10)

export default defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./test/setup.ts",
    clearMocks: true,
    maxConcurrency: 16,
    isolate: true,
    exclude: ["./cli", "./.yarn", "**/node_modules", "**/dist"],
    server: {
      deps: {
        inline: [
          "@niivue/niivue",
        ],
      },
    },
    ...(nodeMajorVersion >= 26 ? { execArgv: ["--no-webstorage"] } : {}),
  },
})
