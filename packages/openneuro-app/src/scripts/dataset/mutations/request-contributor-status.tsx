import React from "react"
import { gql, useMutation } from "@apollo/client"
import * as Sentry from "@sentry/react"

// Define the GraphQL mutation for requesting contributor access
const CREATE_CONTRIBUTOR_REQUEST_EVENT = gql`
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

// Define the GraphQL query to refetch dataset events.
const DATASET_EVENTS_QUERY = gql`
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

export const RequestContributorButton = (
  { datasetId, datasetPermissions, currentUserId },
) => {
  const [createContributorRequest, { loading, error }] = useMutation(
    CREATE_CONTRIBUTOR_REQUEST_EVENT,
    {
      variables: { datasetId },
      refetchQueries: [
        { query: DATASET_EVENTS_QUERY, variables: { datasetId } },
      ],
    },
  )

  // Handle the button click event
  const handleRequest = async () => {
    try {
      await createContributorRequest()
      alert("Your request for contributor access has been sent successfully!")
    } catch (err) {
      Sentry.captureException(err)
      alert(`Failed to send request: ${err.message}`)
    }
  }

  // Determine if the current user already has any permissions (read, write, admin)
  // If they do, the button should not be displayed.
  const hasPermissions = datasetPermissions?.some((p) =>
    p.userId === currentUserId &&
    (p.level === "admin" || p.level === "rw" || p.level === "read")
  )

  if (hasPermissions) {
    return null
  }

  // Render the button
  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150 ease-in-out shadow-md"
    >
      {loading ? "Sending Request..." : "Request Contributor Access"}
    </button>
  )
}
