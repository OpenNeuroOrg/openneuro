import { Command, EnumType } from "@cliffy/command"
import { type LevelName, LogLevelNames } from "@std/log"
import type { ValidatorOptions } from "@bids/validator/options"
import denoJson from "../deno.json" with { type: "json" }
import { setupLogging } from "./logger.ts"
import { login } from "./commands/login.ts"
import { upload } from "./commands/upload.ts"
import { download } from "./commands/download.ts"
import { gitCredential } from "./commands/git-credential.ts"

export type OpenNeuroOptions = {
  datasetPath: string
  localPath?: string
  validatorOptions?: ValidatorOptions
  debug?: LevelName
}

const openneuroCommand = new Command()
  .name("openneuro")
  .description(
    "OpenNeuro command line tools for uploading, downloading, or syncing datasets. See https://docs.openneuro.org for detailed guides.",
  )
  .version(denoJson.version)
  .globalType("debugLevel", new EnumType(LogLevelNames))
  .globalEnv("OPENNEURO_LOG=<type:debugLevel>", "Enable debug output.")
  .globalAction(({ openneuroLog }) => {
    setupLogging(openneuroLog ? openneuroLog : "ERROR")
  })
  .globalEnv("OPENNEURO_API_KEY=<key:string>", "Specify an OpenNeuro API key.")
  .command("login", login)
  .command("download", download)
  .command("upload", upload)
  .command("git-credential", gitCredential)

/**
 * Parse command line options and return a OpenNeuroOptions config
 * @param argumentOverride Override the arguments instead of using Deno.args
 */
export async function commandLine(
  argumentOverride: string[],
): Promise<OpenNeuroOptions> {
  const { args, options } = await openneuroCommand.parse(argumentOverride)

  return {
    datasetPath: args[0] as string,
    ...options,
  }
}
