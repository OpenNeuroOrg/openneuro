import gql from 'graphql-tag'

/**
 * Uploading/removing files in datasets after dataset creation
 *
 * This replicates the functionality of adding files to a SciTran project
 */

export const updateFiles = gql`
  mutation updateFiles($datasetId: ID!, $files: FileTree!) {
    updateFiles(datasetId: $datasetId, files: $files) {
      dataset {
        id
      }
    }
  }
`

/**
 * Sort file streams so that dataset_description.json is first in the list
 *
 * We do this at the top level so that it is uploaded first
 * @param {Array} files
 */
export const sortFiles = files =>
  files.sort((x, y) => {
    const filename = 'dataset_description.json'
    const xPath = x.hasOwnProperty('path') ? x.path : x.webkitRelativePath
    const yPath = y.hasOwnProperty('path') ? y.path : y.webkitRelativePath
    return xPath.endsWith(filename) ? -1 : yPath.endsWith(filename) ? 1 : 0
  })
