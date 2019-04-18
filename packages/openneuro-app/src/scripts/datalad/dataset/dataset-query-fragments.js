import gql from 'graphql-tag'

export const DRAFT_FRAGMENT = gql`
  fragment DatasetDraft on Dataset {
    id
    draft {
      id
      modified
      readme
      partial
      description {
        Name
        Authors
        DatasetDOI
        License
        Acknowledgements
        HowToAcknowledge
        Funding
        ReferencesAndLinks
      }
      files {
        id
        filename
        size
      }
      summary {
        modalities
        sessions
        subjects
        tasks
        size
        totalFiles
      }
    }
  }
`

export const PERMISSION_FRAGMENT = gql`
  fragment DatasetPermissions on Dataset {
    id
    permissions {
      user {
        id
        email
      }
      level
    }
  }
`

export const DATASET_SNAPSHOTS = gql`
  fragment DatasetSnapshots on Dataset {
    id
    snapshots {
      id
      tag
      created
    }
  }
`

export const DATASET_COMMENTS = gql`
  fragment DatasetComments on Dataset {
    id
    comments {
      id
      text
      createDate
      user {
        email
      }
      replies {
        id
        text
        createDate
        user {
          email
        }
        replies {
          id
          text
          createDate
          user {
            email
          }
          replies {
            id
            text
            createDate
            user {
              email
            }
            replies {
              id
              text
              createDate
              user {
                email
              }
            }
          }
        }
      }
    }
  }
`

const ISSUE_FIELDS = `issues {
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
}`

export const DATASET_ISSUES = gql`
  fragment DatasetIssues on Dataset {
    id
    draft {
      id
      ${ISSUE_FIELDS}
    }
  }
`

export const SNAPSHOT_ISSUES = gql`
  fragment SnapshotIssues on Snapshot {
    id
    ${ISSUE_FIELDS}
  }
`
