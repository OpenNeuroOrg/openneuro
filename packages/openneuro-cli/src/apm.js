import elasticApm from 'elastic-apm-node'
import { getErrorReporting } from './config.js'

export let apm
const url = getErrorReporting()
if (url) {
  apm = elasticApm.start({
    serverUrl: url,
    serviceName: 'openneuro-cli',
    environment: 'production',
    logLevel: 'fatal',
  })
}
