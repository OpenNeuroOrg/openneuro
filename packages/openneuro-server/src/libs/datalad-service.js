import crypto from 'crypto'
import config from '../config'

/**
 * Map dataset IDs to a normal distribution of backend workers
 * @param {string} dataset Accession number string - e.g. ds000001
 * @param {number} range Integer bound for offset from hash
 */
export function hashDatasetToRange(dataset, range) {
  const hash = crypto.createHash('sha1').update(dataset, 'utf8')
  const hexstring = hash.digest().toString('hex')
  return parseInt(hexstring.substring(32, 40), 16) % range
}

/**
 * Obtain the statefulset or replica worker number for a dataset
 * @param {string} dataset Accession number string - e.g. ds000001
 * @returns {number}
 */
export function getDatasetEndpoint(dataset) {
  return hashDatasetToRange(dataset, parseInt(config.datalad.workers))
}

/**
 * Find the statefulset or replica URL for a given dataset
 * @param {string} dataset
 */
export function getDatasetWorker(dataset) {
  return `${config.datalad.uri}-${getDatasetEndpoint(dataset)}`
}
