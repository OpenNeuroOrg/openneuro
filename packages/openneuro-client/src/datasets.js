import gql from 'graphql-tag'

export const getDataset = gql`
  query dataset($id: ID!) {
    dataset(id: $id) {
      id
      _id: id
      label
      created
      public
      uploader {
        id
        name
        email
      }
      draft {
        id
        modified
        files {
          id
          filename
          size
          objectpath
        }
        summary {
          modalities
          sessions
          subjects
          tasks
          size
          totalFiles
        }
        issues {
          key
          severity
        }
        partial
      }
      snapshots {
        id
        _id: id
        tag
        created
        snapshot_version: tag
      }
      permissions {
        userId
        _id: userId
        level
        access: level
      }
    }
  }
`

export const getDatasets = gql`
  query {
    datasets {
      id
      _id: id
      created
      label
      uploader {
        id
      }
      public
      permissions {
        userId
        _id: userId
        level
        access: level
      }
      draft {
        id
        partial
      }
    }
  }
`

export const getPartialDataset = gql`
  query dataset($id: ID!) {
    dataset(id: $id) {
      id
      _id: id
      label
      created
      public
      uploader {
        id
        name
        email
      }
      draft {
        id
        partial
      }
    }
  }
`

export const getDatasetIssues = gql`
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      draft {
        id
        issues {
          severity
          code
          reason
          files {
            evidence
            line
            character
            reason
            file {
              name
              path
              relativePath
            }
          }
          additionalFileCount
        }
      }
    }
  }
`

export const validationSubscription = gql`
  subscription {
    datasetValidationUpdated {
      id
    }
  }
`

export const createDataset = gql`
  mutation createDataset($label: String!) {
    createDataset(label: $label) {
      id
      label
    }
  }
`

export const deleteDataset = gql`
  mutation deleteDataset($label: String!) {
    deleteDataset(label: $label) {
      id
    }
  }
`

export const deleteSnapshot = gql`
  mutation deleteSnapshot($datasetId: ID!, $tag: String!) {
    deleteSnapshot(datasetId: $datasetId, tag: $tag)
  }
`

export const updatePublic = gql`
  mutation($id: ID!, $publicFlag: Boolean!) {
    updatePublic(datasetId: $id, publicFlag: $publicFlag)
  }
`

export const updatePermissions = gql`
  mutation($datasetId: ID!, $userId: String!, $level: String) {
    updatePermissions(datasetId: $datasetId, userId: $userId, level: $level)
  }
`

export const removePermissions = gql`
  mutation($datasetId: ID!, $userId: String!) {
    removePermissions(datasetId: $datasetId, userId: $userId)
  }
`
export const checkPartial = gql`
  query partial($datasetId: ID!) {
    partial(datasetId: $datasetId)
  }
`
