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
 * Find the statefulset or replica URL for a given dataset
 * @param {string} dataset
 */
export function getDatasetWorker(dataset) {
  return `${config.datalad.uri}-${hashDatasetToRange(
    dataset,
    parseInt(config.datalad.workers),
  )}`
}
