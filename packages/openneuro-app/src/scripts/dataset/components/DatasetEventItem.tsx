import React, { useEffect, useRef } from "react"
import styles from "./scss/dataset-events.module.scss"

interface Event {
  id: string
  timestamp: string
  note?: string
  event: { type: string }
  user?: { name?: string; email?: string }
}

interface DatasetEventItemProps {
  event: Event
  editingNoteId: string | null
  updatedNote: string
  startEditingNote: (id: string, note: string) => void
  handleUpdateNote: () => void
  setUpdatedNote: (note: string) => void
}

export const DatasetEventItem: React.FC<DatasetEventItemProps> = ({
  event,
  editingNoteId,
  updatedNote,
  startEditingNote,
  handleUpdateNote,
  setUpdatedNote,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

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

  return (
    <li>
      <div className="grid faux-table">
        <div className="col-lg col col-5">
          {editingNoteId === event.id
            ? (
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
            : event.event.type === "note"
            ? (
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
            : (
              event.event.type
            )}
        </div>
        <div className="col-lg col col-3">
          {new Date(event.timestamp).toLocaleString()}
        </div>
        <div className="col-lg col col-3">
          {event.user?.name || event.user?.email || "Unknown"}
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
        </div>
      </div>
    </li>
  )
}
