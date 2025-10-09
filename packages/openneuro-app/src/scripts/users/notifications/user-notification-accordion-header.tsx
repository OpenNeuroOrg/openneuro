import React from "react"
import styles from "./scss/usernotifications.module.scss"

interface NotificationHeaderProps {
  title: string
  isOpen: boolean
  toggleAccordion: () => void
  showReviewButton: boolean
  isProcessing: boolean
  children?: React.ReactNode
  datasetId?: string
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  title,
  isOpen,
  toggleAccordion,
  showReviewButton,
  isProcessing,
  children,
  datasetId,
}) => {
  const renderTitle = () => {
    if (datasetId) {
      const datasetLink = `/datasets/${datasetId}/`
      return (
        <span>
          {title}{" "}
          <a href={datasetLink} className={styles.titlelink}>
            {datasetId}
          </a>
        </span>
      )
    }
    return title
  }
  return (
    <div className={styles.header}>
      <h3 className={styles.accordiontitle}>{renderTitle()}</h3>
      {showReviewButton && (
        <button
          className={styles.readbutton}
          onClick={toggleAccordion}
          disabled={isProcessing}
        >
          {isOpen
            ? (
              <span>
                <i className="fa fa-times"></i> Close
              </span>
            )
            : (
              <span>
                <i className="fa fa-eye"></i> Review
              </span>
            )}
        </button>
      )}
      {children}
    </div>
  )
}
