import XDG from "@404wolf/xdg-portable"
import * as path from "@std/path"
import { logger } from "./logger.ts"
import { LoginError } from "./error.ts"

export interface ClientConfig {
  url: string
  token: string
  errorReporting: boolean
}

export function getConfigPath(): string {
  const xdgConfigPath = XDG.config()
  const configPath = path.join(xdgConfigPath, "openneuro", "config.json")
  return configPath
}

/**
 * Get credentials from local storage
 */
export function getConfig(
  instance: string = "https://openneuro.org",
): ClientConfig {
  const url = Deno.env.get("OPENNEURO_URL") || instance
  const configPath = getConfigPath()
  const config = JSON.parse(
    new TextDecoder().decode(Deno.readFileSync(configPath)),
  )
  const token = Object.hasOwn(config, url) && config[url]
  const errorReporting = Object.hasOwn(config, "errorReporting") &&
    config["errorReporting"] === true
  if (url && token) {
    const config: ClientConfig = {
      url,
      token,
      errorReporting,
    }
    return config
  } else {
    throw new LoginError("Run `openneuro login` before running commands.")
  }
}

export function readConfig(): ClientConfig {
  const config = getConfig()
  logger.info(
    `configured with URL "${config.url}" and token "${
      config.token.slice(
        0,
        4,
      )
    }...${config.token.slice(-4)}"`,
  )
  return config
}
