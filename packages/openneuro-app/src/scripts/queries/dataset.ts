/**
 * Top level dataset queries only, mutations may cause refetches of these
 */
import { gql } from "@apollo/client"
import * as DatasetQueryFragments from "../datalad/dataset/dataset-query-fragments.js"
import { DATASET_COMMENTS } from "../datalad/dataset/comments-fragments.js"

/**
 * Generate the dataset page query
 */
export const getDatasetPage = gql`
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      created
      public
      following
      followers {
        userId
      }
      starred
      stars {
        userId
      }
      worker
      ...DatasetDraft
      ...DatasetPermissions
      ...DatasetSnapshots
      ...DatasetIssues
      ...DatasetMetadata
      ...DatasetComments
      uploader {
        id
        name
        email
        orcid
      }
      analytics {
        downloads
        views
      }
      derivatives {
        name
        s3Url
        dataladUrl
        local
      }
    }
  }
  ${DatasetQueryFragments.DRAFT_FRAGMENT}
  ${DatasetQueryFragments.PERMISSION_FRAGMENT}
  ${DatasetQueryFragments.DATASET_SNAPSHOTS}
  ${DatasetQueryFragments.DATASET_ISSUES}
  ${DatasetQueryFragments.DATASET_METADATA}
  ${DATASET_COMMENTS}
`

/**
 * Add files fragment for draft route
 */
export const getDraftPage = gql`
  query dataset($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      created
      public
      following
      followers {
        userId
      }
      starred
      stars {
        userId
      }
      reviewers {
        id
        expiration
      }
      worker
      ...DatasetDraft
      ...DatasetDraftFiles
      ...DatasetPermissions
      ...DatasetSnapshots
      ...DatasetIssues
      ...DatasetMetadata
      ...DatasetComments
      uploader {
        id
        name
        email
        orcid
      }
      analytics {
        downloads
        views
      }
      derivatives {
        name
        s3Url
        dataladUrl
        local
      }
    }
  }
  ${DatasetQueryFragments.DRAFT_FRAGMENT}
  ${DatasetQueryFragments.DRAFT_FILES_FRAGMENT}
  ${DatasetQueryFragments.PERMISSION_FRAGMENT}
  ${DatasetQueryFragments.DATASET_SNAPSHOTS}
  ${DatasetQueryFragments.DATASET_ISSUES}
  ${DatasetQueryFragments.DATASET_METADATA}
  ${DATASET_COMMENTS}
`
