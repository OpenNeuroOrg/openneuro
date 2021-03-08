/**
 * Dynamically loaded runtime configuration
 */
import { theme } from 'openneuro-content'

// Apply any loaded CSS variables
const loadTheme = (): void => {
  const root: HTMLElement = document.querySelector(':root')
  if (theme) {
    for (const override in theme) {
      if (theme.hasOwnProperty(override)) {
        root.style.setProperty(override, theme[override])
      }
    }
  }
}

/**
 * Interface describing the JSON encoded version of the legacy /crn/config.json endpoint
 */
interface OpenNeuroNetworkConfig {
  url: string
  crn: { url: string }
  auth: {
    google?: {
      clientID: string
    }
    orcid?: {
      clientID: string
      URI: string
      redirectURI: string
    }
    globus?: {
      clientID: string
    }
  }
  analytics?: { trackingId: string }
  sentry?: { environment: string }
  support?: {
    url: string
  }
  github?: string
  publicBucket?: string
  theme?: {}
}

// Cache the result
const loadedConfiguration: OpenNeuroNetworkConfig = {
  url: '',
  crn: {
    url: '',
  },
  auth: {},
}
let loaded = false

export const loadConfig = (): Promise<OpenNeuroNetworkConfig> => {
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

export const getConfig = (): OpenNeuroNetworkConfig => loadedConfiguration
