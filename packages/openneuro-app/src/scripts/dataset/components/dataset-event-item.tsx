import React, { useEffect, useRef } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content.jsx"
import * as Sentry from "@sentry/react"
import styles from "./scss/dataset-events.module.scss"
import { PROCESS_CONTRIBUTOR_REQUEST_MUTATION } from "../../queries/datasetEvents.js"
import { Username } from "../../users/username.js"
import { GET_USER } from "../../queries/user.js"

interface Event {
  id: string
  timestamp: string
  note?: string
  event: {
    type: string
    targetUserId?: string
    status?: string
    requestId?: string
    message?: string
    reason?: string
    datasetId?: string
    resolutionStatus?: string
    target?: {
      id: string
      name?: string
      email?: string
      orcid?: string
    }
  }
  user?: { name?: string; email?: string; id?: string; orcid?: string }
  hasBeenRespondedTo?: boolean
  responseStatus?: string
}

interface DatasetEventItemProps {
  event: Event
  datasetId: string
  editingNoteId: string | null
  updatedNote: string
  startEditingNote: (id: string | null, note: string) => void
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

  const { data: targetUserData, loading: targetUserLoading } = useQuery(
    GET_USER,
    {
      variables: { userId: event.event.targetUserId },
      skip: !event.event.targetUserId ||
        event.event.type !== "contributorResponse",
    },
  )

  const targetUser = targetUserData?.user
  const [processContributorRequest] = useMutation(
    PROCESS_CONTRIBUTOR_REQUEST_MUTATION,
    {
      onCompleted: () => {
        toast.success(
          <ToastContent title="Contributor request processed successfully" />,
        )
        refetchEvents()

        setTimeout(() => {
          setUpdatedNote("")
          if (editingNoteId === event.id) {
            startEditingNote(null, "")
          }
        }, 50)
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

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }

  useEffect(() => {
    // Only adjust height if currently editing this note
    if (editingNoteId === event.id) {
      adjustTextareaHeight()
    }
  }, [updatedNote, editingNoteId, event.id])

  // ---renderNoteContent logic ---
  const renderNoteContent = () => {
    if (editingNoteId === event.id) {
      return (
        <textarea
          ref={textareaRef}
          className={styles.dse_inlineForm}
          value={updatedNote}
          onChange={(e) => {
            setUpdatedNote(e.target.value)
            adjustTextareaHeight()
          }}
          placeholder={event.event.type === "contributorRequest" &&
              !event.hasBeenRespondedTo
            ? "Enter reason for approval/denial (required)"
            : "Enter admin note"}
          style={{ overflow: "hidden", resize: "none" }}
        />
      )
    } else {
      if (event.event.type === "contributorResponse") {
        const statusText = event.event.status === "accepted"
          ? "Accepted"
          : "Denied"
        return (
          <>
            <strong>{statusText} Contributor Request:</strong>
            <div>
              <small>
                Admin: <Username user={event.user} />
                {targetUserLoading ? <span>for ...</span> : targetUser
                  ? (
                    <>
                      for User: <Username user={targetUser} />
                    </>
                  )
                  : event.event.targetUserId
                  ? <>for unknown user (ID: {event.event.targetUserId})</>
                  : null}
              </small>
            </div>
            <div>
              <small>
                <b>Reason:</b>
                <br />
                {event.note}
              </small>
            </div>
          </>
        )
      } else if (event.event.type === "contributorRequest") {
        return (
          <>
            {event.note}
            <div>
              <small>
                User: <Username user={event.user} />
              </small>
            </div>
          </>
        )
      } else if (event.event.type === "note") {
        return (
          <>
            {event.note}
          </>
        )
      } else {
        return event.event.type
      }
    }
  }

  const handleSaveOrProcessRequest = async (status?: "accepted" | "denied") => {
    if (status) {
      if (!event.user?.id) {
        toast.error("Cannot process request: User ID not found.")
        return
      }

      if (!updatedNote.trim()) {
        toast.error(
          <ToastContent
            title="Reason Required"
            body="Please provide a reason for your decision to accept or deny."
          />,
        )
        return
      }

      try {
        await processContributorRequest({
          variables: {
            datasetId,
            requestId: event.id,
            targetUserId: event.user.id,
            status,
            reason: updatedNote.trim(),
          },
        })
      } catch (err) {
        console.error("Error processing contributor request:", err)
      }
    } else {
      handleUpdateNote()
    }
  }

  return (
    <li>
      <div className="grid faux-table">
        <div className="col-lg col col-4">{renderNoteContent()}</div>
        <div className="col-lg col col-3">
          {new Date(event.timestamp).toLocaleString()}
        </div>
        <div className="col-lg col col-3">
          <Username user={event.user} />
        </div>
        <div className="col-lg col col-2 text--right">
          {event.event.type === "note" && editingNoteId !== event.id && (
            <button
              onClick={() => startEditingNote(event.id, event.note || "")}
              className="on-button on-button--small on-button--primary"
            >
              Edit
            </button>
          )}

          {event.event.type === "note" && editingNoteId === event.id && (
            <button
              onClick={() => handleSaveOrProcessRequest()}
              className="on-button on-button--small on-button--primary"
            >
              Save Note
            </button>
          )}

          {event.event.type === "contributorRequest" &&
            !event.hasBeenRespondedTo && (
            <div className="text--right">
              {editingNoteId !== event.id && (
                <button
                  onClick={() => startEditingNote(event.id, "")}
                  className="on-button on-button--small on-button--primary"
                >
                  Process
                </button>
              )}

              {editingNoteId === event.id && (
                <>
                  <button
                    onClick={() => handleSaveOrProcessRequest("accepted")}
                    className={`${styles.eventActionButton} on-button on-button--small on-button--secondary`}
                    style={{ marginBottom: "5px" }}
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleSaveOrProcessRequest("denied")}
                    className={`${styles.eventActionButton} on-button on-button--small`}
                  >
                    Deny
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  )
}
