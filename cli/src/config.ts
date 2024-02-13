import { LoginError } from "./error.ts"

export interface ClientConfig {
  url: string
  token: string
  errorReporting: boolean
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
