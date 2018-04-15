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
