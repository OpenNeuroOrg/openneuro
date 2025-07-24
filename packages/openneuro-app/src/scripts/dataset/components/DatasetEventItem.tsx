import React, { useEffect, useRef } from "react"
import { gql, useMutation } from "@apollo/client"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content.jsx"
import * as Sentry from "@sentry/react"
import styles from "./scss/dataset-events.module.scss"

// Define the mutation for processing contributor requests
const PROCESS_CONTRIBUTOR_REQUEST_MUTATION = gql`
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

interface Event {
  id: string
  timestamp: string
  note?: string
  event: {
    type: string
    targetUserId?: string
    status?: string
    requestId?: string
  }
  user?: { name?: string; email?: string; id?: string; orcid?: string }
  hasBeenRespondedTo?: boolean
  responseStatus?: "accepted" | "denied"
}

interface DatasetEventItemProps {
  event: Event
  datasetId: string
  editingNoteId: string | null
  updatedNote: string
  startEditingNote: (id: string, note: string) => void
  handleUpdateNote: () => void
  setUpdatedNote: (note: string) => void
  refetchEvents: () => void
}

export const DatasetEventItem: React.FC<DatasetEventItemProps> = ({
  event,
  datasetId,
  editingNoteId,
  updatedNote,
  startEditingNote,
  handleUpdateNote,
  setUpdatedNote,
  refetchEvents,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [processContributorRequest] = useMutation(
    PROCESS_CONTRIBUTOR_REQUEST_MUTATION,
    {
      onCompleted: () => {
        toast.success(
          <ToastContent title="Contributor request processed successfully" />,
        )
        refetchEvents()
      },
      onError: (error) => {
        Sentry.captureException(error)
        toast.error(
          <ToastContent
            title="Failed to process contributor request"
            body={error.message || "An unknown error occurred"}
          />,
        )
      },
    },
  )

  // Function to adjust/resize the height
  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  useEffect(() => {
    adjustTextareaHeight()
  }, [updatedNote])

  const renderNoteContent = () => {
    if (editingNoteId === event.id) {
      // If the item is currently in edit mode
      return (
        <textarea
          ref={textareaRef}
          className={styles.dse_inlineForm}
          value={updatedNote}
          onChange={(e) => {
            setUpdatedNote(e.target.value)
            adjustTextareaHeight()
          }}
          style={{ overflow: "hidden", resize: "none" }}
        />
      )
    } else {
      if (
        event.event.type === "note" ||
        event.event.type === "contributorRequest" ||
        event.event.type === "contributorResponse"
      ) {
        return (
          <pre
            style={{
              whiteSpace: "pre-wrap",
              margin: 0,
              background: "transparent",
              overflow: "visible",
              border: 0,
            }}
          >
              {event.note}
          </pre>
        )
      } else {
        return event.event.type
      }
    }
  }

  // Function to handle processing the request
  const handleProcessRequest = async (status: "accepted" | "denied") => {
    if (!event.user?.id) {
      toast.error("Cannot process request: User ID not found.")
      return
    }

    const reason = status === "accepted"
      ? "Approved by admin."
      : "Denied by admin."

    try {
      await processContributorRequest({
        variables: {
          datasetId,
          requestId: event.id,
          targetUserId: event.user.id,
          status,
          reason,
        },
      })
    } catch (err) {
      console.error("Error processing contributor request:", err)
    }
  }

  return (
    <li className={event.hasBeenRespondedTo ? styles.requestRespondedTo : ""}>
      <div className="grid faux-table">
        <div className="col-lg col col-5">
          {renderNoteContent()}
        </div>
        <div className="col-lg col col-3">
          {new Date(event.timestamp).toLocaleString()}
        </div>
        <div className="col-lg col col-3">
          {event.event.type === "contributorRequest" && event.user?.orcid
            ? (
              <a href={`/user/${event.user.orcid}`}>
                Profile: {event.user?.name || event.user?.email || "Unknown"}
              </a>
            )
            : <>{event.user?.name || event.user?.email || "Unknown"}</>}
        </div>
        <div className="col-lg col col-1">
          {event.event.type === "note" && editingNoteId !== event.id && (
            <button
              onClick={() => startEditingNote(event.id, event.note || "")}
              className="on-button on-button--small on-button--primary"
            >
              Edit
            </button>
          )}
          {editingNoteId === event.id && (
            <button
              onClick={handleUpdateNote}
              className="on-button on-button--small on-button--primary"
            >
              Save
            </button>
          )}

          {event.event.type === "contributorRequest" &&
            !event.hasBeenRespondedTo && (
            <>
              <button
                onClick={() => handleProcessRequest("accepted")}
                className="on-button on-button--small on-button--success"
                style={{ marginBottom: "5px" }}
              >
                Accept
              </button>
              <button
                onClick={() =>
                  handleProcessRequest("denied")}
                className="on-button on-button--small on-button--danger"
              >
                Deny
              </button>
            </>
          )}

          {event.event.type === "contributorRequest" &&
            event.hasBeenRespondedTo && (
            <span
              className={event.responseStatus === "accepted"
                ? styles.acceptedStatus
                : styles.deniedStatus}
            >
              {event.responseStatus === "accepted" ? "Accepted" : "Denied"}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}
