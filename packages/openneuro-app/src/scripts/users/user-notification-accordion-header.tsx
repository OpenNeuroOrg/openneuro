import React from "react"
import styles from "./scss/usernotifications.module.scss"

interface NotificationHeaderProps {
  title: string
  isOpen: boolean
  toggleAccordion: () => void
  showReviewButton: boolean
  isProcessing: boolean
  children?: React.ReactNode
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  title,
  isOpen,
  toggleAccordion,
  showReviewButton,
  isProcessing,
  children,
}) => (
  <div className={styles.header}>
    <h3 className={styles.accordiontitle}>{title}</h3>
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
