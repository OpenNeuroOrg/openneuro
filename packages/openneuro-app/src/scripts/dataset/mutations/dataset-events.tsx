import React, { useState } from "react"
import styles from "./scss/dataset-events.module.scss"
import { toast } from "react-toastify"
import ToastContent from "../../common/partials/toast-content.jsx"

// Dummy data for dataset events
const dummyEvents = [
  {
    id: "1",
    datasetId: "ds001",
    user: "user123",
    event: "Dataset Created",
    note: "Initial dataset creation",
    success: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    datasetId: "ds001",
    user: "user456",
    event: "Dataset Updated",
    note: "Updated metadata",
    success: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  },
  {
    id: "3",
    datasetId: "ds001",
    user: "user789",
    event: "Snapshot Created",
    note:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    success: true,
    createdAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  },
]

export const DatasetEvents = ({ datasetId }: { datasetId: string }) => {
  const [events, setEvents] = useState(
    dummyEvents.filter((event) => event.datasetId === datasetId),
  )
  const [newEvent, setNewEvent] = useState({
    event: "",
    note: "",
    success: true,
  })
  const [showForm, setShowForm] = useState(false)

  const filteredEvents = events.filter((event) => event.datasetId === datasetId)

  const handleAddEvent = () => {
    if (newEvent.event && newEvent.note) {
      const newEventObj = {
        id: String(events.length + 1),
        datasetId,
        user: "user999", // Dummy user for now
        event: newEvent.event,
        note: newEvent.note,
        success: newEvent.success,
        createdAt: new Date().toISOString(),
      }

      setEvents([...events, newEventObj])

      setNewEvent({ event: "", note: "", success: true })

      setShowForm(false)
      toast.success(<ToastContent title="Event creation Success" />)
    } else {
      toast.error(
        <ToastContent
          title="Event creation failed"
          body="Please fill in both the event type and note"
        />,
      )
    }
  }

  const toggleForm = () => {
    setShowForm((prevState) => !prevState)
  }

  if (filteredEvents.length === 0) {
    return <p>No events found for this dataset.</p>
  }

  return (
    <div className={styles.datasetEvents}>
      <div className={styles.datasetEventHeader}>
        <h4>Dataset Events</h4>
        <span
          className={styles.addEventBtn +
            " on-button on-button--small on-button--primary icon-text"}
          onClick={toggleForm}
        >
          {showForm ? "Cancel" : "Add New Event"}
        </span>
      </div>

      {/* Add new event form */}
      {showForm && (
        <div className={styles.addEventForm}>
          <input
            type="text"
            placeholder="Event type"
            value={newEvent.event}
            onChange={(e) =>
              setNewEvent({ ...newEvent, event: e.target.value })}
          />
          <textarea
            placeholder="Event note"
            value={newEvent.note}
            onChange={(e) => setNewEvent({ ...newEvent, note: e.target.value })}
          />
          <button
            className="on-button on-button--small on-button--primary"
            onClick={handleAddEvent}
          >
            Add Event
          </button>
        </div>
      )}

      {/* Event list */}
      <div className="grid faux-table-header">
        <h4 className="col-lg col col-5">Note</h4>
        <h4 className="col-lg col col-3">Date</h4>
        <h4 className="col-lg col col-2">Author</h4>
        <h4 className="col-lg col col-2">Type</h4>
      </div>
      <ul>
        {filteredEvents.map((event) => (
          <li key={event.id}>
            <div className="grid faux-table">
              <div className="col-lg col col-5">{event.note}</div>
              <div className="col-lg col col-3">
                {new Date(event.createdAt).toLocaleString()}
              </div>
              <div className="col-lg col col-2">{event.user}</div>
              <div className="col-lg col col-2">{event.event}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
