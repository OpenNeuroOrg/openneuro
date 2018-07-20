/**
 * Dynamically loaded runtime configuration
 */
import { theme } from 'openneuro-content'

// Apply any loaded CSS variables
const loadTheme = () => {
  const root = document.querySelector(':root')
  if (theme) {
    for (const override in theme) {
      if (theme.hasOwnProperty(override)) {
        root.style.setProperty(override, theme[override])
      }
    }
  }
}

// Cache the result
const loadedConfiguration = {}
let loaded = false

export const loadConfig = () => {
  return loaded
    ? Promise.resolve(loadedConfiguration)
    : fetch('/crn/config.json')
        .then(res => res.json())
        .then(config => {
          Object.assign(loadedConfiguration, config)
          loadTheme()
          loaded = true
          return config
        })
}

export const getConfig = () => loadedConfiguration
