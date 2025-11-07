/**
 * Entrypoint for OpenNeuro CLI
 */
import * as Sentry from "@sentry/deno"
import denoJson from "./deno.json" with { type: "json" }
Sentry.init({
  dsn:
    "https://bf1156f5c83c236e0fcc4980535ebca4@o4507748938350592.ingest.us.sentry.io/4507748943200256",
  release: `openneuro-cli@${denoJson.version}`,
})
import { commandLine } from "./src/options.ts"
import { annexSpecialRemote } from "./src/commands/special-remote.ts"

/**
 * Entrypoint for running OpenNeuro command line tools
 */
export async function main() {
  if (Deno.execPath().endsWith("git-annex-remote-openneuro")) {
    await annexSpecialRemote()
  } else {
    await commandLine(Deno.args)
  }
  Deno.exit(0)
}

await main()
