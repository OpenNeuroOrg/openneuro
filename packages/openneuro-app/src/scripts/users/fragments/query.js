import { gql } from "@apollo/client"

export const INDEX_DATASET_FRAGMENT = gql`
  fragment DatasetIndex on Dataset {
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
    metadata {
      ages
    }
    latestSnapshot {
      id
      size
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
      validation {
        errors
        warnings
      }
      description {
        Name
        Authors
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
`
