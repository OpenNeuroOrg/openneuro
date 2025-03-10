import React, { useState } from "react"
import { gql, useMutation, useQuery } from "@apollo/client"
import styles from "./scss/dataset-events.module.scss"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content.jsx"
import * as Sentry from "@sentry/react"

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
        }
      }
    }
  }
`

const SAVE_ADMIN_NOTE_MUTATION = gql`
  mutation SaveAdminNote($datasetId: ID!, $note: String!) {
    saveAdminNote(datasetId: $datasetId, note: $note) {
      id
      note
      success
      timestamp
      user {
        email
      }
    }
  }
`

export const DatasetEvents = ({ datasetId }: { datasetId: string }) => {
  const { data, loading, error } = useQuery(GET_DATASET_EVENTS, {
    variables: { datasetId },
  })
  const [newEvent, setNewEvent] = useState({ note: "" })
  const [showForm, setShowForm] = useState(false)

  const [saveAdminNote] = useMutation(SAVE_ADMIN_NOTE_MUTATION, {
    onCompleted: () => {
      toast.success(<ToastContent title="Admin note added successfully" />)
      setNewEvent({ note: "" })
      setShowForm(false)
    },
    onError: (error) => {
      Sentry.captureException(error)
      toast.error(
        <ToastContent
          title="Failed to add admin note"
          body="An error occurred while saving the admin note"
        />,
      )
    },
  })

  const toggleForm = () => setShowForm((prev) => !prev)

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
            onClick={() => {
              if (newEvent.note) {
                saveAdminNote({ variables: { datasetId, note: newEvent.note } })
              } else {
                toast.error(
                  <ToastContent
                    title="Failed to add admin note"
                    body="Please fill in the note"
                  />,
                )
              }
            }}
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
            <h4 className="col-lg col col-2">Author</h4>
            <h4 className="col-lg col col-2">Type</h4>
          </div>
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <div className="grid faux-table">
                  <div className="col-lg col col-5">{event.note}</div>
                  <div className="col-lg col col-3">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                  <div className="col-lg col col-2">
                    {event.user?.email || "Unknown"}
                  </div>
                  <div className="col-lg col col-2">
                    {event.success ? "Success" : "Failure"}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
