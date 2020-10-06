/**
 * Prefix all files with a path
 * This supports uploading within another directory
 * @param {FileList} fileList FileList for upload
 * @param {string} path Prefix path for all files
 * @returns {Array} Updated array of files with adapted paths
 */
export const addPathToFiles = (fileList, path) => {
  return path
    ? Array.prototype.map.call(fileList, file => {
        // Override webkitRelativePath with a new property
        Object.defineProperty(file, 'webkitRelativePath', {
          value: `/${path}/${file.webkitRelativePath}`,
          writable: false,
        })
        return file
      })
    : fileList
}
