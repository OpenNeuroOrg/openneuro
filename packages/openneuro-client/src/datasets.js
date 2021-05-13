import { gql } from '@apollo/client'

export const getDataset = gql`
  query getDataset($id: ID!) {
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
  query getDraftFiles($id: ID!) {
    dataset(id: $id) {
      id
      draft {
        id
        files(prefix: null) {
          filename
          size
        }
      }
      metadata {
        affirmedDefaced
        affirmedConsent
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

export const searchDatasets = gql`
  query searchDatasets($q: String!, $cursor: String) {
    searchDatasets(q: $q, first: 25, after: $cursor) {
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
  query getDatasetIssues($datasetId: ID!) {
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

export const createDataset = gql`
  mutation createDataset($affirmedDefaced: Boolean, $affirmedConsent: Boolean) {
    createDataset(
      affirmedDefaced: $affirmedDefaced
      affirmedConsent: $affirmedConsent
    ) {
      id
      worker
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
  mutation updatePublic($id: ID!, $publicFlag: Boolean!) {
    updatePublic(datasetId: $id, publicFlag: $publicFlag)
  }
`

export const updatePermissions = gql`
  mutation updatePermissions(
    $datasetId: ID!
    $userEmail: String!
    $level: String
  ) {
    updatePermissions(
      datasetId: $datasetId
      userEmail: $userEmail
      level: $level
    ) {
      id
      email
    }
  }
`

export const removePermissions = gql`
  mutation removePermissions($datasetId: ID!, $userId: String!) {
    removePermissions(datasetId: $datasetId, userId: $userId)
  }
`

export const trackAnalytics = gql`
  mutation trackAnalytics(
    $datasetId: ID!
    $tag: String
    $type: AnalyticTypes!
  ) {
    trackAnalytics(datasetId: $datasetId, tag: $tag, type: $type)
  }
`

export const downloadDataset = gql`
  query downloadDataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      draft {
        id
        files(prefix: null) {
          id
          filename
          size
          urls
        }
      }
    }
  }
`

export const downloadSnapshot = gql`
  query downloadSnapshot($datasetId: ID!, $tag: String!) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      files(prefix: null) {
        id
        filename
        size
        urls
      }
    }
  }
`
