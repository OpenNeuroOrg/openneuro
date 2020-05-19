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
