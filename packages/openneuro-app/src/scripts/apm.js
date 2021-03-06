import { init as initApm } from '@elastic/apm-rum'
import { config } from './config'
import { version } from '../lerna.json'

export let apm

export function setupApm() {
  if (
    config.sentry.environment === 'production' ||
    config.sentry.environment === 'staging'
  ) {
    apm = initApm({
      serverUrl: config.url,
      serviceName: 'openneuro-app',
      serviceVersion: version,
      environment: config.sentry.environment,
    })
  } else {
    apm = initApm({
      serverUrl: config.url,
      serviceName: 'openneuro-app',
      serviceVersion: version,
      environment: config.sentry.environment,
      active: false,
      logLevel: 'error',
    })
  }
}

setupApm()
