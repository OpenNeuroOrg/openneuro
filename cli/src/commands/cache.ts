import { Command } from "@cliffy/command"
import type { CommandOptions } from "@cliffy/command"
import { cleanCache } from "../cache.ts"

export async function cacheCleanAction(options: CommandOptions) {
  const dryRun = Boolean(options.dryRun)
  const url = typeof options.url === "string" ? options.url : undefined

  const cleaned = await cleanCache({ dryRun, url })
  if (cleaned.length === 0) {
    console.log("No cached repositories found.")
    return
  }

  for (const item of cleaned) {
    if (dryRun) {
      console.log(`Would remove: ${item.path}`)
    } else {
      console.log(`Removed cache directory: ${item.path}`)
    }
  }

  if (dryRun) {
    console.log(
      `Found ${cleaned.length} cache director${
        cleaned.length === 1 ? "y" : "ies"
      }.`,
    )
  } else {
    console.log(
      `Cleared ${cleaned.length} cache director${
        cleaned.length === 1 ? "y" : "ies"
      }.`,
    )
  }
}

export const cacheClean = new Command()
  .name("clean")
  .description("Clear temporary local repository cache.")
  .option("-d, --dry-run", "List cached directories without deleting them.")
  .option(
    "-u, --url <url:string>",
    "Clear cache for a specific OpenNeuro instance URL.",
  )
  .action(cacheCleanAction)

export const cache = new Command()
  .name("cache")
  .description("Manage local cache and temporary repositories.")
  .action(function () {
    this.showHelp()
  })
  .command("clean", cacheClean)
