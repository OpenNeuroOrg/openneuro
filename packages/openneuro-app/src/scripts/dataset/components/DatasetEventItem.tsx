import React, { useEffect, useRef, useState } from 'react'
import { gql, useMutation } from '@apollo/client'
import { toast } from 'react-toastify'
import ToastContent from '../../common/partials/toast-content.jsx'
import * as Sentry from '@sentry/react'
import styles from './scss/dataset-events.module.scss'

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
    status?: 'accepted' | 'denied'
    requestId?: string
  }
  user?: { name?: string; email?: string; id?: string; orcid?: string }
  hasBeenRespondedTo?: boolean
  responseStatus?: 'accepted' | 'denied'
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

  const [processContributorRequest] = useMutation(
    PROCESS_CONTRIBUTOR_REQUEST_MUTATION,
    {
      onCompleted: () => {
        toast.success(
          <ToastContent title="Contributor request processed successfully" />,
        )
        refetchEvents()

        setTimeout(() => {
          setUpdatedNote('')
          if (editingNoteId === event.id) {
            startEditingNote(null, '')
          }
        }, 50)
      },
      onError: error => {
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
      textareaRef.current.style.height = 'auto'
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
    // If the item is currently in edit mode AND it's the current event
    if (editingNoteId === event.id) {
      return (
        <textarea
          ref={textareaRef}
          className={styles.dse_inlineForm}
          value={updatedNote}
          onChange={e => {
            setUpdatedNote(e.target.value)
            adjustTextareaHeight()
          }}
          placeholder={
            event.event.type === 'contributorRequest' &&
            !event.hasBeenRespondedTo
              ? 'Enter reason for approval/denial (required)'
              : 'Enter admin note'
          }
          style={{ overflow: 'hidden', resize: 'none' }}
        />
      )
    } else {
      // Display content based on event type when not in edit mode
      if (event.event.type === 'contributorResponse') {
        const statusText =
          event.event.status === 'accepted' ? 'Accepted' : 'Denied'
        return (
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              margin: 0,
              background: 'transparent',
              overflow: 'visible',
              border: 0,
            }}>
            <strong>{statusText}: </strong>
            {event.note} {/* request response reason */}
            <div>
              <small>
                {event.user?.orcid ? (
                  <a href={`/user/${event.user.orcid}`}>
                    Admin: {event.user?.name || event.user?.email || 'Unknown'}
                  </a>
                ) : (
                  // Fallback if no ORCID
                  `Admin: ${event.user?.name || event.user?.email || 'Unknown'}`
                )}{' '}
              </small>
            </div>
          </pre>
        )
      } else if (event.event.type === 'contributorRequest') {
        return (
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              margin: 0,
              background: 'transparent',
              overflow: 'visible',
              border: 0,
            }}>
            {event.note} 
            <div>
              <small>
                {event.user?.orcid ? (
                  <a href={`/user/${event.user.orcid}`}>
                    User: {event.user?.name || event.user?.email || 'Unknown'}
                  </a>
                ) : (
                  // Fallback if no ORCID
                  `User: ${event.user?.name || event.user?.email || 'Unknown'}`
                )}
              </small>
            </div>
          </pre>
        )
      } else if (event.event.type === 'note') {
        return (
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              margin: 0,
              background: 'transparent',
              overflow: 'visible',
              border: 0,
            }}>
            {event.note}
          </pre>
        )
      } else {
        return event.event.type 
      }
    }
  }

  const handleSaveOrProcessRequest = async (status?: 'accepted' | 'denied') => {
    if (status) {
      if (!event.user?.id) {
        toast.error('Cannot process request: User ID not found.')
        return
      }

      // Validation for reason
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
        console.error('Error processing contributor request:', err)
      }
    } else {
      handleUpdateNote()
    }
  }

  return (
    <li>
      <div className="grid faux-table">
        <div className="col-lg col col-5">{renderNoteContent()}</div>
        <div className="col-lg col col-3">
          {new Date(event.timestamp).toLocaleString()}
        </div>
        <div className="col-lg col col-3">
          {event.user?.orcid ? (
            <a href={`/user/${event.user.orcid}`}>
              {event.user?.name || event.user?.email || 'Unknown'}
            </a>
          ) : (
            <>{event.user?.name || event.user?.email || 'Unknown'}</>
          )}
        </div>
        <div className="col-lg col col-1">
          {event.event.type === 'note' && editingNoteId !== event.id && (
            <button
              onClick={() => startEditingNote(event.id, event.note || '')}
              className="on-button on-button--small on-button--primary">
              Edit
            </button>
          )}

          {event.event.type === 'note' && editingNoteId === event.id && (
            <button
              onClick={() => handleSaveOrProcessRequest()} 
              className="on-button on-button--small on-button--primary">
              Save Note
            </button>
          )}

          {event.event.type === 'contributorRequest' &&
            !event.hasBeenRespondedTo && (
              <>
                {editingNoteId !== event.id && ( 
                  <button
                    onClick={() => startEditingNote(event.id, '')} 
                    className="on-button on-button--small on-button--primary">
                    Process
                  </button>
                )}

                {editingNoteId === event.id && ( 
                  <>
                    <button
                      onClick={() => handleSaveOrProcessRequest('accepted')} 
                      className="on-button on-button--small on-button--success"
                      style={{ marginBottom: '5px' }} 
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleSaveOrProcessRequest('denied')} 
                      className="on-button on-button--small on-button--danger"
                    >
                      Deny
                    </button>
                  </>
                )}
              </>
            )}
        </div>
      </div>
    </li>
  )
}