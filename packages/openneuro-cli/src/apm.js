import elasticApm from 'elastic-apm-node'
import { getErrorReporting } from './config.js'
import packageJson from '../package.json'

export let apm
const url = getErrorReporting()
if (url) {
  apm = elasticApm.start({
    serverUrl: url,
    serviceName: 'openneuro-cli',
    serviceVersion: packageJson.version,
    environment: 'production',
    logLevel: 'fatal',
  })
}
