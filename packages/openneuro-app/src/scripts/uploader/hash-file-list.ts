/**
 * Java hashcode implementation for browser and Node.js
 * @param {string} str
 */
function hashCode(str) {
  return str
    .split("")
    .reduce(
      (prevHash, currVal) =>
        ((prevHash << 5) - prevHash + currVal.charCodeAt(0)) | 0,
      0,
    )
}

/**
 * Calculate a hash from a list of files to upload
 * @param {string} datasetId Dataset namespace for this hash
 * @param {Array<object>} files Files being uploaded
 * @returns {string} Hex string identity hash
 */
export function hashFileList(datasetId, files) {
  return Math.abs(
    hashCode(
      datasetId +
        files
          .map(
            (f) =>
              `${
                "webkitRelativePath" in f ? f.webkitRelativePath : f.filename
              }:${f.size}`,
          )
          .sort()
          .join(":"),
    ),
  ).toString(16)
}
