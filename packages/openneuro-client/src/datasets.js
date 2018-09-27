import gql from 'graphql-tag'

export const getDataset = gql`
  query dataset($id: ID!) {
    dataset(id: $id) {
      id
      _id: id
      created
      public
      uploader {
        id
        name
        email
      }
      draft {
        id
        description {
          Name
        }
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
        user {
          id
          name
          email
          provider
        }
      }
    }
  }
`

// Get only working tree files
export const getUntrackedFiles = gql`
  query dataset($id: ID!) {
    dataset(id: $id) {
      id
      draft {
        id
        files(untracked: true) {
          filename
          size
        }
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
      uploader {
        id
        name
      }
      public
      permissions {
        userId
        _id: userId
        level
        access: level
        user {
          id
          name
          email
          provider
        }
      }
      draft {
        id
        partial
        summary {
          modalities
          sessions
          subjects
          tasks
          size
          totalFiles
        }
        description {
          Name
        }
      }
      analytics {
        views
        downloads
      }
      stars {
        userId
        datasetId
      }
      followers {
        userId
        datasetId
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
    }
  }
`

export const deleteDataset = gql`
  mutation deleteDataset($id: ID!) {
    deleteDataset(id: $id) {
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
  mutation($datasetId: ID!, $userEmail: String!, $level: String) {
    updatePermissions(
      datasetId: $datasetId
      userEmail: $userEmail
      level: $level
    )
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

export const trackAnalytics = gql`
  mutation($datasetId: ID!, $tag: String, $type: AnalyticTypes!) {
    trackAnalytics(datasetId: $datasetId, tag: $tag, type: $type)
  }
`
