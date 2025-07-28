import React from "react"
import { gql, useMutation } from "@apollo/client"
import * as Sentry from "@sentry/react"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content.jsx"

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
      // Add onCompleted and onError handlers for toasts
      onCompleted: () => {
        toast.success(
          <ToastContent title="Your request for contributor access has been sent successfully!" />,
        )
      },
      onError: (err) => {
        Sentry.captureException(err)
        toast.error(
          <ToastContent
            title="Failed to send request"
            body={err.message || "An unknown error occurred"}
          />,
        )
      },
    },
  )

  const handleRequest = async () => {
    try {
      await createContributorRequest()
    } catch (err) {
      console.error(
        "Error during request creation (caught by handleRequest):",
        err,
      ) // Keep this for console logging errors
    }
  }

  // Determine if the current user already has any permissions (read, write, admin)
  // If they do, the button should not be displayed.
  const hasPermissions = datasetPermissions?.some((p) =>
    p.user.id === currentUserId &&
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
