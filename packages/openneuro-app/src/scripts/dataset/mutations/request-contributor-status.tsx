import React from "react"
import { useMutation } from "@apollo/client"
import * as Sentry from "@sentry/react"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content.jsx"
import {
  CREATE_CONTRIBUTOR_REQUEST_EVENT,
  DATASET_EVENTS_QUERY,
} from "../../queries/datasetEvents.js"

export const RequestContributorButton = (
  { datasetId, datasetPermissions, currentUserId },
) => {
  const [createContributorRequest, { loading }] = useMutation(
    CREATE_CONTRIBUTOR_REQUEST_EVENT,
    {
      variables: { datasetId },
      refetchQueries: [
        { query: DATASET_EVENTS_QUERY, variables: { datasetId } },
      ],
      onCompleted: () => {
        toast.success(
          <ToastContent title="Your request for contributor access has been sent successfully!" />,
        )
      },
      onError: (error) => {
        Sentry.captureException(error)
        toast.error(
          <ToastContent
            title="Failed to send request"
            body={error.message || "An unknown error occurred"}
          />,
        )
      },
    },
  )

  const handleRequest = async () => {
    try {
      await createContributorRequest()
    } catch (error) {
      Sentry.captureException(error)
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
