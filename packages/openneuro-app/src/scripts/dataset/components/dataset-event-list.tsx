import React from "react"
import { DatasetEventItem } from "./dataset-event-item"

interface ProcessedDatasetEvent {
  id: string
  note: string
  timestamp: string
  user: {
    id: string
    name: string
    email: string
    orcid: string
  }
  event: {
    type: string
    requestId?: string
    status?: string
  }
  success: boolean
  hasBeenRespondedTo?: boolean
  responseStatus?: string
}

interface DatasetEventListProps {
  events: ProcessedDatasetEvent[]
  datasetId: string
  editingNoteId: string | null
  updatedNote: string
  startEditingNote: (eventId: string, note: string) => void
  handleUpdateNote: () => void
  setUpdatedNote: (note: string) => void
  refetchEvents: () => void
}

export const DatasetEventList: React.FC<DatasetEventListProps> = ({
  events,
  datasetId,
  editingNoteId,
  updatedNote,
  startEditingNote,
  handleUpdateNote,
  setUpdatedNote,
  refetchEvents,
}) => {
  if (events.length === 0) {
    return <p>No events found for this dataset.</p>
  }

  return (
    <>
      <div className="grid faux-table-header">
        <h4 className="col-lg col col-5">Note</h4>
        <h4 className="col-lg col col-3">Date</h4>
        <h4 className="col-lg col col-2">Author</h4>
        <h4 className="col-lg col col-2 text--right">Action</h4>
      </div>
      <ul>
        {events.map((event) => (
          <DatasetEventItem
            key={event.id}
            event={event}
            datasetId={datasetId}
            editingNoteId={editingNoteId}
            updatedNote={updatedNote}
            startEditingNote={startEditingNote}
            handleUpdateNote={handleUpdateNote}
            setUpdatedNote={setUpdatedNote}
            refetchEvents={refetchEvents}
          />
        ))}
      </ul>
    </>
  )
}
