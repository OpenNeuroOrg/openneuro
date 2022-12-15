import { gql } from '@apollo/client'

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
        orcid
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
          secondaryModalities
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
          pet {
            BodyPart
            ScannerManufacturer
            ScannerManufacturersModelName
            TracerName
            TracerRadionuclide
          }
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
  query dataset($id: ID!, $tree: String) {
    dataset(id: $id) {
      id
      draft {
        id
        files(tree: $tree) {
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
            orcid
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
              secondaryModalities
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
              pet {
                BodyPart
                ScannerManufacturer
                ScannerManufacturersModelName
                TracerName
                TracerRadionuclide
              }
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
  mutation createDataset($affirmedDefaced: Boolean, $affirmedConsent: Boolean) {
    createDataset(
      affirmedDefaced: $affirmedDefaced
      affirmedConsent: $affirmedConsent
    ) {
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
  mutation ($id: ID!, $publicFlag: Boolean!) {
    updatePublic(datasetId: $id, publicFlag: $publicFlag)
  }
`

export const updatePermissions = gql`
  mutation ($datasetId: ID!, $userEmail: String!, $level: String) {
    updatePermissions(
      datasetId: $datasetId
      userEmail: $userEmail
      level: $level
    )
  }
`

export const removePermissions = gql`
  mutation ($datasetId: ID!, $userId: String!) {
    removePermissions(datasetId: $datasetId, userId: $userId)
  }
`

export const trackAnalytics = gql`
  mutation ($datasetId: ID!, $tag: String, $type: AnalyticTypes!) {
    trackAnalytics(datasetId: $datasetId, tag: $tag, type: $type)
  }
`

export const downloadDataset = gql`
  query downloadDraft($datasetId: ID!, $tree: String) {
    dataset(id: $datasetId) {
      id
      draft {
        id
        files(tree: $tree) {
          id
          directory
          filename
          size
          urls
        }
      }
    }
  }
`

export const downloadSnapshot = gql`
  query downloadSnapshot($datasetId: ID!, $tag: String!, $tree: String) {
    snapshot(datasetId: $datasetId, tag: $tag) {
      id
      files(tree: $tree) {
        id
        directory
        filename
        size
        urls
      }
    }
  }
`
