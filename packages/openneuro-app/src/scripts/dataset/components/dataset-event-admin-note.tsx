import React from "react"
import styles from "./scss/dataset-events.module.scss"

interface AdminNoteFormProps {
  newEvent: { note: string }
  setNewEvent: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleAddEvent: () => void
}

export const AdminNoteForm: React.FC<AdminNoteFormProps> = ({
  newEvent,
  setNewEvent,
  handleAddEvent,
}) => (
  <div className={styles.addEventForm}>
    <textarea
      placeholder="Admin note"
      value={newEvent.note}
      onChange={setNewEvent}
    />
    <button
      className="on-button on-button--small on-button--primary"
      onClick={handleAddEvent}
    >
      Save Admin Note
    </button>
  </div>
)
