import React, { useCallback, useMemo, useState } from "react"
import { useMutation, useQuery } from "@apollo/client"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content.jsx"
import * as Sentry from "@sentry/react"
import styles from "../components/scss/dataset-events.module.scss"
import {
  GET_DATASET_EVENTS,
  SAVE_ADMIN_NOTE_MUTATION,
  UPDATE_ADMIN_NOTE_MUTATION,
} from "../../queries/datasetEvents.js"

import { DatasetEventsHeader } from "../components/dataset-event-header"
import { AdminNoteForm } from "../components/dataset-event-admin-note"
import { DatasetEventList } from "../components/dataset-event-list"

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
    onError: (mutationError) => {
      Sentry.captureException(error)
      toast.error(
        <ToastContent title="Error adding note" body={mutationError.message} />,
      )
    },
  })

  const [updateAdminNote] = useMutation(UPDATE_ADMIN_NOTE_MUTATION, {
    onCompleted: () => {
      toast.success(<ToastContent title="Admin note updated successfully" />)
      setEditingNoteId(null)
      setUpdatedNote("")
      refetch()
    },
    onError: (mutationError) => {
      Sentry.captureException(mutationError)
      toast.error(
        <ToastContent
          title="Error updating note"
          body={mutationError.message}
        />,
      )
    },
  })

  const rawEvents = data?.dataset?.events || []

  const processedEvents = useMemo(() => {
    const responsesMap = new Map()
    rawEvents.forEach((event) => {
      if (event.event.type === "contributorResponse" && event.event.requestId) {
        responsesMap.set(event.event.requestId, event)
      }
    })

    const enrichedEvents = rawEvents.map((event) => {
      if (event.event.type === "contributorRequest") {
        const response = responsesMap.get(event.id)
        if (response) {
          return {
            ...event,
            hasBeenRespondedTo: true,
            responseStatus: response.event.status,
          }
        }
      }
      return event
    })
    return enrichedEvents
  }, [rawEvents])

  const sortedEvents = useMemo(() => {
    return [...processedEvents].sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [processedEvents])

  const handleAddEvent = useCallback(() => {
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
  }, [newEvent.note, datasetId, saveAdminNote])

  const handleUpdateNote = useCallback(() => {
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
  }, [updatedNote, datasetId, editingNoteId, updateAdminNote])

  const toggleForm = useCallback(() => {
    setShowForm((prevState) => !prevState)
  }, [])

  const startEditingNote = useCallback((eventId, note) => {
    setEditingNoteId(eventId)
    setUpdatedNote(note)
  }, [])

  // Handler for AdminNoteForm's onChange
  const handleNewEventChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setNewEvent({ note: e.target.value })
    },
    [],
  )

  if (loading) return <p>Loading events...</p>
  if (error) return <p>Error fetching events: {error.message}</p>

  return (
    <div className={styles.datasetEvents}>
      <DatasetEventsHeader showForm={showForm} toggleForm={toggleForm} />

      {/* admin note form */}
      {showForm && (
        <AdminNoteForm
          newEvent={newEvent}
          setNewEvent={handleNewEventChange}
          handleAddEvent={handleAddEvent}
        />
      )}

      {/* Event list */}
      <DatasetEventList
        events={sortedEvents}
        datasetId={datasetId}
        editingNoteId={editingNoteId}
        updatedNote={updatedNote}
        startEditingNote={startEditingNote}
        handleUpdateNote={handleUpdateNote}
        setUpdatedNote={setUpdatedNote}
        refetchEvents={refetch}
      />
    </div>
  )
}
