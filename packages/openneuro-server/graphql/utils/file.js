/**
 * generates unique id for untracked files
 * @param {string} filepath - filepath ('/' delimiters)
 * @param {number|string} [size] - of file
 */
export const generateFileId = (filepath, size) => `${filepath}:${size}`

export function UpdatedFile(filepath, size) {
  this.id = generateFileId(filepath, size)
  this.filename = filepath
  if (size) this.size = size
}
