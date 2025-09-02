import { gql } from "@apollo/client"

export const DRAFT_FRAGMENT = gql`
  fragment DatasetDraft on Dataset {
    id
    draft {
      id
      modified
      readme
      head
      size
      fileCheck {
        datasetId
        hexsha
        refs
        remote
        annexFsck {
          errorMessages
          file
          key
          success
        }
      }
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
        validatorMetadata {
          validator
          version
        }
      }
      creators {
        name
        givenName 
        familyName 
        orcid 
      }
      contributors {
        name
        givenName 
        familyName 
        orcid 
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
        urls
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
          orcid
          name
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

// For the schema valdiator
export const VALIDATION_FIELDS = `
  code
  location
  rule
  severity
  subCode
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
      issuesStatus {
        errors
        warnings
      }
      validation {
        errors
        warnings
      }
    }
  }
`

export const SNAPSHOT_ISSUES = gql`
  fragment SnapshotIssues on Snapshot {
    id
    issuesStatus {
      errors
      warnings
    }
    validation {
      errors
      warnings
    }
  }
`

export const SNAPSHOT_FIELDS = gql`
  fragment SnapshotFields on Snapshot {
    id
    tag
    created
    readme
    size
    deprecated {
      id
      user
      reason
      timestamp
    }
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
      urls
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
      validatorMetadata {
        validator
        version
      }
    }
    analytics {
      downloads
      views
    }
    ...SnapshotIssues
    hexsha
    creators {
      name
      givenName 
      familyName 
      orcid 
    }
    contributors {
      name
      givenName 
      familyName 
      orcid 
    }
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
