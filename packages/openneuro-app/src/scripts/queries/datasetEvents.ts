import { gql } from "@apollo/client"

export const GET_DATASET_EVENTS = gql`
  query GetDatasetEvents($datasetId: ID!) {
    dataset(id: $datasetId) {
      events {
        id
        note
        success
        timestamp
        user {
          email
          name
          orcid
          id
        }
        event {
          type
          requestId 
          status    
          targetUserId
          resolutionStatus
        }
      }
    }
  }
`

export const SAVE_ADMIN_NOTE_MUTATION = gql`
  mutation SaveAdminNote($datasetId: ID!, $note: String!) {
    saveAdminNote(datasetId: $datasetId, note: $note) {
      note
    }
  }
`

export const UPDATE_ADMIN_NOTE_MUTATION = gql`
  mutation SaveAdminNote(
    $note: String!
    $datasetId: ID!
    $saveAdminNoteId: ID
  ) {
    saveAdminNote(note: $note, datasetId: $datasetId, id: $saveAdminNoteId) {
      id
      note
    }
  }
`

export const PROCESS_CONTRIBUTOR_REQUEST_MUTATION = gql`
  mutation ProcessContributorRequest(
    $datasetId: ID!
    $requestId: ID!
    $targetUserId: ID!
    $status: String!
    $reason: String
  ) {
    processContributorRequest(
      datasetId: $datasetId
      requestId: $requestId
      targetUserId: $targetUserId
      status: $status
      reason: $reason
    ) {
      id
      event {
        type
        status
        requestId
      }
      note
    }
  }
`

export const UPDATE_NOTIFICATION_STATUS_MUTATION = gql`
  mutation UpdateNotificationStatus($datasetEventId: ID!, $status: String!) {
    updateNotificationStatus(datasetEventId: $datasetEventId, status: $status) {
      id
      status
    }
  }
`

//  mutation for requesting contributor access
export const CREATE_CONTRIBUTOR_REQUEST_EVENT = gql`
  mutation CreateContributorRequestEvent($datasetId: ID!) {
    createContributorRequestEvent(datasetId: $datasetId) {
      id
      timestamp
      event {
        type
      }
      success
      note
    }
  }
`

// query to refetch dataset events.
export const DATASET_EVENTS_QUERY = gql`
  query DatasetEvents($datasetId: ID!) {
    dataset(id: $datasetId) {
      id
      events {
        id
        timestamp
        user {
          id
          name
        }
        event {
          type
          # Include other fields relevant to event descriptions if needed
          # e.g., version, public, target, level, commit, reference, admin, targetUserId, status, reason
        }
        success
        note
      }
    }
  }
`
