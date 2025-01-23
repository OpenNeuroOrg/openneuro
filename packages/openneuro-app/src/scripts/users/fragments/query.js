import { gql } from "@apollo/client"

export const INDEX_DATASET_FRAGMENT = gql`
  fragment DatasetIndex on Dataset {
    id
    created
    name
    public
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
    latestSnapshot {
        id
        size
        created
        issues {
        severity
        }
        description {
        Name
        Authors
        SeniorAuthor
        DatasetType
        }
    }
    draft {
        id
    }
    uploader {
        id
    }
  }
`
