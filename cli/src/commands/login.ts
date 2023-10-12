/**
 * Configure credentials and other persistent settings for OpenNeuro
 */
import { Command, Confirm, Secret, Select } from "../deps.ts"
import type { CommandOptions } from "../deps.ts"
import { LoginError } from "../error.ts"

export interface ClientConfig {
  url: string
  token: string
  errorReporting: boolean
}

const messages = {
  url:
    "URL for OpenNeuro instance to upload to (e.g. `https://openneuro.org`).",
  token: "API key for OpenNeuro. See https://openneuro.org/keygen",
  errorReporting:
    "Enable error reporting. Errors and performance metrics are sent to the configured OpenNeuro instance.",
}

/**
 * Get credentials from local storage
 */
export function getConfig(): ClientConfig {
  const url = localStorage.getItem("url")
  const token = localStorage.getItem("token")
  const errorReporting = localStorage.getItem("errorReporting") === "true"
  if (url && token && errorReporting) {
    const config: ClientConfig = {
      url,
      token,
      errorReporting,
    }
    return config
  } else {
    throw new LoginError("Run `openneuro login` before upload.")
  }
}

export async function loginAction(options: CommandOptions) {
  const url = options.url ? options.url : await Select.prompt({
    message: "Choose an OpenNeuro instance to use.",
    options: [
      "https://openneuro.org",
      "https://staging.openneuro.org",
      "http://localhost:9876",
    ],
  })
  localStorage.setItem("url", url)
  const token = options.token ? options.token : await Secret.prompt(
    `Enter your API key for OpenNeuro (get an API key from ${url}/keygen).`,
  )
  localStorage.setItem("token", token)
  const errorReporting = options.hasOwnProperty("errorReporting")
    ? options.errorReporting
    : await Confirm.prompt(messages.errorReporting)
  localStorage.setItem("errorReporting", errorReporting.toString())
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
