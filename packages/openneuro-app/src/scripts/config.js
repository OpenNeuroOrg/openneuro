/**
 * Dynamically loaded runtime configuration
 */

// Apply any loaded CSS variables
const loadTheme = config => {
  const root = document.querySelector(':root')
  if (config.theme) {
    for (const override in config.theme) {
      if (config.theme.hasOwnProperty(override)) {
        root.style.setProperty(override, config.theme[override])
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
          loadTheme(config)
          loaded = true
          return config
        })
}

export const getConfig = () => loadedConfiguration
