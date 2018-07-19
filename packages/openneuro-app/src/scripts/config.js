/**
 * Dynamically loaded runtime configuration
 */

// Apply any loaded CSS variables
const loadTheme = config => {
  const root = document.querySelector(':root')
  if (config.theme && config.theme.variables) {
    for (const override of config.theme.variables) {
      root.style.setProperty(override.key, override.value)
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
