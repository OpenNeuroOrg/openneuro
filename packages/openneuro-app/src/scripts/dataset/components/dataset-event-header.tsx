import React from "react"
import styles from "./scss/dataset-events.module.scss"

interface DatasetEventsHeaderProps {
  showForm: boolean
  toggleForm: () => void
}

export const DatasetEventsHeader: React.FC<DatasetEventsHeaderProps> = ({
  showForm,
  toggleForm,
}) => (
  <div className={styles.datasetEventHeader}>
    <h4>Dataset Events</h4>
    <span
      className={`${styles.addEventBtn} on-button on-button--small on-button--primary icon-text`}
      onClick={toggleForm}
    >
      {showForm ? "Cancel" : "Add Admin Note"}
    </span>
  </div>
)
