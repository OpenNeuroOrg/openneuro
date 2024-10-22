import fs from "fs"
import os from "os"
import path from "path"
import jwtDecode from "jwt-decode"

/**
 * Get the nearest working configuration
 */
export const getConfig = () => {
  const homePath = path.join(os.homedir(), ".openneuro")
  const localPath = path.join(process.cwd(), ".openneuro")
  if (fs.existsSync(homePath)) {
    return homePath
  } else if (fs.existsSync(localPath)) {
    return localPath
  } else {
    return null
  }
}

export const readConfig = () => {
  const config = getConfig()
  if (config) {
    return fs.readFileSync(config, "utf8")
  } else {
    return JSON.stringify({})
  }
}

/**
 * Save a config object to a default location
 *
 * `$HOME/.openneuro`
 *
 * @param {Object} config
 */
export const saveConfig = (config) => {
  const home = os.homedir()
  const savePath = path.join(home, ".openneuro")
  fs.writeFileSync(savePath, JSON.stringify(config))
}

/**
 * Read the current configuration and return the configured token or throw an error
 */
export const getToken = () => {
  const config = JSON.parse(readConfig())
  if (Object.hasOwn(config, "apikey")) {
    return config.apikey
  } else {
    throw new Error(
      "You must have an API key configured to continue, try `openneuro login` first",
    )
  }
}

/**
 * Get the user object from the configured token
 * @returns {any}
 */
export const getUser = () => {
  const token = getToken()
  return jwtDecode(token)
}

export const getUrl = () => {
  const config = JSON.parse(readConfig())
  if (Object.hasOwn(config, "url")) {
    return config.url
  } else {
    throw new Error(
      "You must have a URL configured to continue, try `openneuro login` first",
    )
  }
}

export const getErrorReporting = () => {
  const config = JSON.parse(readConfig())
  if (
    Object.hasOwn(config, "errorReporting") &&
    Object.hasOwn(config, "url") &&
    config.errorReporting
  ) {
    return config.url
  } else {
    return false
  }
}
