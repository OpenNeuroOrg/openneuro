import elasticApm from 'elastic-apm-node'
import { getErrorReporting } from './config.js'
import packageJson from '../package.json'

const url = getErrorReporting()

/**
 * Configure APM for error reporting
 * @param {boolean} active Enable or disable
 */
const setupApm = active =>
  elasticApm.start({
    serverUrl: url,
    serviceName: 'openneuro-cli',
    serviceVersion: packageJson.version,
    environment: 'production',
    logLevel: 'fatal',
    active,
  })

export const apm = setupApm(url ? true : false)
