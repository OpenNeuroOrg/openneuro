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
  { dataset, currentUserId },
) => {
  const [createContributorRequest, { loading }] = useMutation(
    CREATE_CONTRIBUTOR_REQUEST_EVENT,
    {
      variables: { datasetId: dataset.id },
      refetchQueries: [
        { query: DATASET_EVENTS_QUERY, variables: { datasetId: dataset.id } },
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

  // TODO
  // Check if the current user's ORCID is present in the
  // dataset.contributors array. TODO as contributors doesn't
  // exist on Datasets yet
  const isContributor = dataset?.contributors?.some((contributor) =>
    contributor.orcid === currentUserId
  )

  if (isContributor) {
    return null
  }

  // Render the button
  return (
    <button
      onClick={handleRequest}
      disabled={loading}
      className="on-button on-button--small on-button--primary request-contributor-button"
    >
      {loading ? "Sending Request..." : "Request Contributor Access"}
    </button>
  )
}
