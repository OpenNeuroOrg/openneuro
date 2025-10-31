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
          targetUserId
          resolutionStatus
        }
        hasBeenRespondedTo
        responseStatus
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
    $resolutionStatus: String!
    $reason: String
  ) {
    processContributorRequest(
      datasetId: $datasetId
      requestId: $requestId
      targetUserId: $targetUserId
      resolutionStatus: $resolutionStatus
      reason: $reason
    ) {
      id
      event {
        type
        requestId
        resolutionStatus
      }
      note
    }
  }
`

export const UPDATE_NOTIFICATION_STATUS_MUTATION = gql`
  mutation UpdateEventStatus($eventId: ID!, $status: NotificationStatusType!) {
    updateEventStatus(eventId: $eventId, status: $status) {
      status
    }
  }
`

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
        }
        success
        note
      }
    }
  }
`

export const CREATE_CONTRIBUTOR_CITATION_EVENT = gql`
  mutation CreateContributorCitationEvent(
    $datasetId: ID!
    $targetUserId: ID!
    $contributorData: ContributorInput!
  ) {
    createContributorCitationEvent(
      datasetId: $datasetId
      targetUserId: $targetUserId
      contributorData: $contributorData
    ) {
      id
      timestamp
      success
      user {
        id
        name
      }
      event {
        type
        resolutionStatus
        contributorData {
          name
          givenName
          familyName
          orcid
          contributorType
          order
        }
      }
      note
    }
  }
`

export const PROCESS_CONTRIBUTOR_CITATION_MUTATION = gql`
  mutation ProcessContributorCitation($eventId: ID!, $status: String!) {
    processContributorCitation(eventId: $eventId, status: $status) {
      id
      timestamp
      success
      user {
        id
        name
      }
      event {
        type
        targetUserId
        contributorData {
          name
          givenName
          familyName
          orcid
          contributorType
          order
        }
        resolutionStatus
      }
    }
  }
`
