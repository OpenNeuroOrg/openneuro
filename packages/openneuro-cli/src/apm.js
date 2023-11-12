import elasticApm from "elastic-apm-node"
import { getErrorReporting } from "./config.js"

const url = getErrorReporting()

/**
 * Configure APM for error reporting
 * @param {boolean} active Enable or disable
 * @returns {typeof import('elastic-apm-node')}
 */
const setupApm = (active) =>
  elasticApm.isStarted() ? elasticApm : elasticApm.start({
    serverUrl: url,
    serviceName: "openneuro-cli",
    environment: "production",
    logLevel: "fatal",
    active,
  })

/**
 * @type {typeof import('elastic-apm-node')}
 */
export const apm = setupApm(url ? true : false)
