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
      files {
        name
        size
      }
    }
  }
`
