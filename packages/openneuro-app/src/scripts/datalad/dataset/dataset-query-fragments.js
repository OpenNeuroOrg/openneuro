import { gql } from '@apollo/client'

export const DRAFT_FRAGMENT = gql`
  fragment DatasetDraft on Dataset {
    id
    draft {
      id
      modified
      readme
      head
      description {
        Name
        Authors
        DatasetDOI
        License
        Acknowledgements
        HowToAcknowledge
        Funding
        ReferencesAndLinks
        EthicsApprovals
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
    }
  }
`

export const DRAFT_FILES_FRAGMENT = gql`
  fragment DatasetDraftFiles on Dataset {
    id
    draft {
      id
      files {
        id
        key
        filename
        size
        directory
        annexed
      }
    }
  }
`

export const PERMISSION_FRAGMENT = gql`
  fragment DatasetPermissions on Dataset {
    id
    permissions {
      id
      userPermissions {
        user {
          id
          email
        }
        level
      }
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
      hexsha
    }
  }
`

export const ISSUE_FIELDS = `
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
`

export const DATASET_ISSUES = gql`
  fragment DatasetIssues on Dataset {
    id
    draft {
      id
      issues { 
        ${ISSUE_FIELDS}
      }
    }
  }
`

export const SNAPSHOT_ISSUES = gql`
  fragment SnapshotIssues on Snapshot {
    id
    issues {
      ${ISSUE_FIELDS}
    }
  }
`

export const SNAPSHOT_FIELDS = gql`
  fragment SnapshotFields on Snapshot {
    id
    tag
    created
    readme
    description {
      Name
      Authors
      DatasetDOI
      License
      Acknowledgements
      HowToAcknowledge
      Funding
      ReferencesAndLinks
      EthicsApprovals
    }
    files {
      id
      key
      filename
      size
      directory
      annexed
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
    analytics {
      downloads
      views
    }
    ...SnapshotIssues
    hexsha
  }
  ${SNAPSHOT_ISSUES}
`

export const DATASET_METADATA = gql`
  fragment DatasetMetadata on Dataset {
    id
    metadata {
      datasetId
      datasetUrl
      datasetName
      firstSnapshotCreatedAt
      latestSnapshotCreatedAt
      dxStatus
      tasksCompleted
      trialCount
      grantFunderName
      grantIdentifier
      studyDesign
      studyDomain
      studyLongitudinal
      dataProcessed
      species
      associatedPaperDOI
      openneuroPaperDOI
      seniorAuthor
      adminUsers
      ages
      modalities
      affirmedDefaced
      affirmedConsent
    }
  }
`
