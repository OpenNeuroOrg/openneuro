import fs from 'fs'
import os from 'os'
import path from 'path'
import findConfig from 'find-config'

/**
 * Get the nearest working configuration
 */
export const getConfig = () => {
  return findConfig('.openneuro')
}

export const readConfig = () => {
  return fs.readFileSync(getConfig())
}

/**
 * Save a config object to a default location
 *
 * `$HOME/.openneuro`
 *
 * @param {Object} config
 */
export const saveConfig = config => {
  const home = os.homedir()
  const savePath = path.join(home, '.openneuro')
  fs.writeFileSync(savePath, JSON.stringify(config))
}

/**
 * Read the current configuration and return the configured token or throw an error
 */
export const getToken = () => {
  const config = JSON.parse(readConfig())
  if (config.hasOwnProperty('apikey')) {
    return config.apikey
  } else {
    throw new Error(
      'You must have an API key configured to continue, try `openneuro login` first',
    )
  }
}

export const getUrl = () => {
  const config = JSON.parse(readConfig())
  if (config.hasOwnProperty('url')) {
    return config.url
  } else {
    throw new Error(
      'You must have a URL configured to continue, try `openneuro login` first',
    )
  }
}
