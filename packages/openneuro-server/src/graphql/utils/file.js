import RemovedAnnexObject from '../../models/removedAnnexObject.js'

/**
 * Generates unique id for untracked files.
 * @param {string} filepath - filepath ('/' delimiters)
 * @param {number|string} [size] - of file
 */
export const generateFileId = (filepath, size) => `${filepath}:${size}`

/**
 * Creates a file object with an ApolloGQL cache-safe id.
 * @class
 * @param {string} filepath ':' delimited
 * @param {string|number} [size]
 */
export function UpdatedFile(filepath, size) {
  /**
   * unique id
   * @id UpdatedFile#id
   * @type {string}
   */
  this.id = generateFileId(filepath, size)
  /**
   * filename with '/' delimiters
   * @filename UpdatedFile#filename
   * @type {string}
   */
  this.filename = filepath
  if (size) this.size = size
}

export const filterRemovedAnnexObjects = datasetId => async files => {
  const removedAnnexObjectKeys = (
    await RemovedAnnexObject.find({ datasetId }).exec()
  ).map(({ annexKey }) => annexKey)
  // keep files that havent had their annex objects removed
  return files.filter(({ key }) => !removedAnnexObjectKeys.includes(key))
}
