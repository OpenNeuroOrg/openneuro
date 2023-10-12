/**
 * Entrypoint for OpenNeuro CLI
 */
import { commandLine } from './src/options.ts'

export async function main() {
  await commandLine(Deno.args)
}

await main()
