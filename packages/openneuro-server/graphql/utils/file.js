/**
 * generates unique id for untracked files
 * @param {string} filepath - filepath ('/' delimiters)
 * @param {number|string} size - of file
 */
export const generateFileId = (filepath, size) => `${filepath}:${size}`
