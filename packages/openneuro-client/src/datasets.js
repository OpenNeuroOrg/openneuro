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
          subjectMetadata {
            participantId
            age
            sex
            group
          }
          tasks
          size
          totalFiles
          dataProcessed
        }
        issues {
          key
          severity
        }
      }
      snapshots {
        id
        _id: id
        tag
        created
        snapshot_version: tag
      }
      permissions {
        id
        userPermissions {
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
  }
`

// Get only working tree files
export const getDraftFiles = gql`
  query dataset($id: ID!) {
    dataset(id: $id) {
      id
      draft {
        id
        files(prefix: null) {
          filename
          size
        }
      }
    }
  }
`

export const getDatasets = gql`
  query getDatasets(
    $cursor: String
    $orderBy: DatasetSort = { created: descending }
    $filterBy: DatasetFilter = {}
    $myDatasets: Boolean = false
  ) {
    datasets(
      first: 25
      after: $cursor
      orderBy: $orderBy
      filterBy: $filterBy
      myDatasets: $myDatasets
    ) {
      edges {
        node {
          id
          created
          uploader {
            id
            name
          }
          public
          permissions {
            id
            userPermissions {
              userId
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
          draft {
            id
            summary {
              modalities
              sessions
              subjects
              subjectMetadata {
                participantId
                age
                sex
                group
              }
              tasks
              size
              totalFiles
              dataProcessed
            }
            issues {
              severity
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
          snapshots {
            id
            created
            tag
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasPreviousPage
        hasNextPage
        count
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
  mutation createDataset {
    createDataset {
      id
    }
  }
`

export const deleteDataset = gql`
  mutation deleteDataset($id: ID!, $reason: String, $redirect: String) {
    deleteDataset(id: $id, reason: $reason, redirect: $redirect)
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

export const trackAnalytics = gql`
  mutation($datasetId: ID!, $tag: String, $type: AnalyticTypes!) {
    trackAnalytics(datasetId: $datasetId, tag: $tag, type: $type)
  }
`
