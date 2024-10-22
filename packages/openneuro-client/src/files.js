/**
 * Sort file streams so that dataset_description.json is first in the list
 *
 * We do this at the top level so that it is uploaded first
 * @param {Array} files
 */
export const sortFiles = (files) =>
  files.sort((x, y) => {
    const filename = "dataset_description.json"
    const xPath = Object.hasOwn(x, "path") ? x.path : x.webkitRelativePath
    const yPath = Object.hasOwn(y, "path") ? y.path : y.webkitRelativePath
    return xPath.endsWith(filename) ? -1 : yPath.endsWith(filename) ? 1 : 0
  })
