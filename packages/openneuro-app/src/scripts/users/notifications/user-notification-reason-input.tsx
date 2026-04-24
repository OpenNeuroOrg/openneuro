import React from "react"
import type { ResponseStatusType } from "../../../gql/graphql"
import { formatStatusForDisplay } from "./notification-mapper"
import styles from "./scss/usernotifications.module.scss"

interface NotificationReasonInputProps {
  reasonInput: string
  setReasonInput: (reason: string) => void
  currentApprovalAction:
    | ResponseStatusType.Accepted
    | ResponseStatusType.Denied
    | null
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
          formatStatusForDisplay(currentApprovalAction) || "approval"
        } action`}
      </label>
      <textarea
        id={textareaId}
        value={reasonInput}
        onChange={(e) => setReasonInput(e.target.value)}
        placeholder={`Reason for ${
          formatStatusForDisplay(currentApprovalAction)
        }...`}
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
