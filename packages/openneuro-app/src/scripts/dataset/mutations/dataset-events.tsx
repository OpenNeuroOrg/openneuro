import React, { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content.jsx"
import * as Sentry from "@sentry/react"
import { DatasetEventItem } from "../components/DatasetEventItem"
import styles from "../components/scss/dataset-events.module.scss"

// Query to fetch events for the given dataset
const GET_DATASET_EVENTS = gql`
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
        }
        event {
          type
        }
      }
    }
  }
`

const SAVE_ADMIN_NOTE_MUTATION = gql`
  mutation SaveAdminNote($datasetId: ID!, $note: String!) {
    saveAdminNote(datasetId: $datasetId, note: $note) {
      note
    }
  }
`

const UPDATE_ADMIN_NOTE_MUTATION = gql`
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

export const DatasetEvents = ({ datasetId }) => {
  const { data, loading, error, refetch } = useQuery(GET_DATASET_EVENTS, {
    variables: { datasetId },
    fetchPolicy: "network-only",
  })

  const [newEvent, setNewEvent] = useState({ note: "" })
  const [showForm, setShowForm] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState(null)
  const [updatedNote, setUpdatedNote] = useState("")

  const [saveAdminNote] = useMutation(SAVE_ADMIN_NOTE_MUTATION, {
    onCompleted: () => {
      toast.success(<ToastContent title="Admin note added successfully" />)
      setNewEvent({ note: "" })
      setShowForm(false)
      refetch()
    },
    onError: (error) => {
      Sentry.captureException(error)
    },
  })

  const [updateAdminNote] = useMutation(UPDATE_ADMIN_NOTE_MUTATION, {
    onCompleted: () => {
      toast.success(<ToastContent title="Admin note updated successfully" />)
      setEditingNoteId(null)
      setUpdatedNote("")
      refetch()
    },
    onError: (error) => {
      Sentry.captureException(error)
    },
  })

  const handleAddEvent = () => {
    if (newEvent.note) {
      saveAdminNote({
        variables: {
          datasetId,
          note: newEvent.note,
        },
      })
    } else {
      toast.error(
        <ToastContent
          title="Failed to add admin note"
          body="Please fill in the note"
        />,
      )
    }
  }

  const handleUpdateNote = () => {
    if (updatedNote) {
      updateAdminNote({
        variables: {
          datasetId,
          note: updatedNote,
          saveAdminNoteId: editingNoteId,
        },
      })
    } else {
      toast.error("Please fill in the updated note")
    }
  }

  const toggleForm = () => {
    setShowForm((prevState) => !prevState)
  }

  const startEditingNote = (eventId, note) => {
    setEditingNoteId(eventId)
    setUpdatedNote(note)
  }

  if (loading) return <p>Loading events...</p>
  if (error) return <p>Error fetching events</p>

  const events = data?.dataset?.events || []

  return (
    <div className={styles.datasetEvents}>
      <div className={styles.datasetEventHeader}>
        <h4>Dataset Events</h4>
        <span
          className={`${styles.addEventBtn} on-button on-button--small on-button--primary icon-text`}
          onClick={toggleForm}
        >
          {showForm ? "Cancel" : "Add Admin Note"}
        </span>
      </div>

      {/* Add new admin note form */}
      {showForm && (
        <div className={styles.addEventForm}>
          <textarea
            placeholder="Admin note"
            value={newEvent.note}
            onChange={(e) => setNewEvent({ note: e.target.value })}
          />
          <button
            className="on-button on-button--small on-button--primary"
            onClick={handleAddEvent}
          >
            Save Admin Note
          </button>
        </div>
      )}

      {/* Event list */}
      {events.length === 0 ? <p>No events found for this dataset.</p> : (
        <>
          <div className="grid faux-table-header">
            <h4 className="col-lg col col-5">Note</h4>
            <h4 className="col-lg col col-3">Date</h4>
            <h4 className="col-lg col col-3">Author</h4>
            <h4 className="col-lg col col-1">Action</h4>
          </div>
          <ul>
            {events.map((event) => (
              <DatasetEventItem
                key={event.id}
                event={event}
                editingNoteId={editingNoteId}
                updatedNote={updatedNote}
                startEditingNote={startEditingNote}
                handleUpdateNote={handleUpdateNote}
                setUpdatedNote={setUpdatedNote}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
