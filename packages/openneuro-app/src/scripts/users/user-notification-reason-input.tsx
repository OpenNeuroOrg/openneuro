// src/components/usernotifications/NotificationReasonInput.tsx
import React from "react"
import styles from "./scss/usernotifications.module.scss"

interface NotificationReasonInputProps {
  reasonInput: string
  setReasonInput: (reason: string) => void
  currentApprovalAction: "accepted" | "denied" | null
  handleReasonCancel: () => void
  handleReasonSubmit: () => void
  isProcessing: boolean
}

export const NotificationReasonInput: React.FC<NotificationReasonInputProps> = (
  {
    reasonInput,
    setReasonInput,
    currentApprovalAction,
    handleReasonCancel,
    handleReasonSubmit,
    isProcessing,
  },
) => {
  const textareaId = "notification-reason-input"

  return (
    <div className={styles.reasonInputContainer}>
      <label htmlFor={textareaId} className="sr-only">
        {`Reason for ${
          currentApprovalAction ? currentApprovalAction : "approval"
        } action`}
      </label>
      <textarea
        id={textareaId} // Assign the ID
        value={reasonInput}
        onChange={(e) => setReasonInput(e.target.value)}
        placeholder={`Reason for ${currentApprovalAction}...`}
        rows={3}
        className={styles.reasonTextarea}
        style={{ width: "100%" }}
      />
      <div className={styles.reasonButtons}>
        <button
          className={`${styles.reasonCancelButton} on-button on-button--ghost on-button--small`}
          onClick={handleReasonCancel}
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          className={`${styles.reasonSaveButton} on-button on-button--primary on-button--small`}
          onClick={handleReasonSubmit}
          disabled={isProcessing}
        >
          Save
        </button>
      </div>
    </div>
  )
}
