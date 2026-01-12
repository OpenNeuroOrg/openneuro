/**
 * Configure credentials and other persistent settings for OpenNeuro
 */
import { Command } from "@cliffy/command"
import type { CommandOptions } from "@cliffy/command"
import { Confirm, Secret, Select } from "@cliffy/prompt"
import * as path from "@std/path"
import { getConfigPath } from "../config.ts"

const messages = {
  url:
    "URL for OpenNeuro instance to upload to (e.g. `https://openneuro.org`).",
  token: "API key for OpenNeuro. See https://openneuro.org/keygen",
  errorReporting:
    "Enable error reporting. Errors and performance metrics are sent to the configured OpenNeuro instance.",
}

export async function loginAction(options: CommandOptions) {
  const configPath = getConfigPath()
  Deno.mkdirSync(path.dirname(configPath), { recursive: true })
  const config: { [key: string]: string } = {}
  try {
    Object.assign(
      config,
      JSON.parse(new TextDecoder().decode(await Deno.readFile(configPath))),
    )
  } catch {
    // If the file doesn't exist or is invalid, start with an empty config
  }
  const url = options.openneuroUrl || "https://openneuro.org"
  let token
  // Environment variable
  if (options.openneuroApiKey) {
    token = options.openneuroApiKey
  }
  // Command line
  if (options.token) {
    token = options.token
  }
  if (!token) {
    token = await Secret.prompt(
      `Enter your API key for OpenNeuro (get an API key from ${url}/keygen).`,
    )
  }
  const errorReporting = Object.hasOwn(options, "errorReporting")
    ? options.errorReporting
    : await Confirm.prompt(messages.errorReporting)
  config["errorReporting"] = errorReporting
  config[url] = token
  await Deno.writeFile(
    configPath,
    new TextEncoder().encode(JSON.stringify(config)),
  )
}

export const login = new Command()
  .name("login")
  .description(
    "Setup credentials for OpenNeuro. Set -u, -t, and -e flags to skip interactive prompts.",
  )
  .option("-u, --url <url>", messages.url)
  .option("-t, --token <token>", messages.token)
  .option("-e, --error-reporting <boolean>", messages.errorReporting)
  .action(loginAction)
