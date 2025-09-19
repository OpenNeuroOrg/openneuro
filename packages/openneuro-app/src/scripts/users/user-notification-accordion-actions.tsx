import React from "react"
import type { MappedNotification } from "../types/event-types"
import { StatusActionButton } from "./components/status-action-buttons"
import iconUnread from "../../assets/icon-unread.png"
import iconSaved from "../../assets/icon-saved.png"
import iconArchived from "../../assets/icon-archived.png"
import styles from "./scss/usernotifications.module.scss"

interface NotificationActionButtonsProps {
  notification: MappedNotification
  isProcessing: boolean
  onUpdate: (id: string, updates: Partial<MappedNotification>) => void
  setError: (error: string | null) => void
  handleProcessAction: (action: "accepted" | "denied") => void
  handleStatusChange: (
    newStatus: "unread" | "saved" | "archived",
  ) => Promise<void>
}

export const NotificationActionButtons: React.FC<
  NotificationActionButtonsProps
> = ({
  notification,
  isProcessing,
  handleProcessAction,
  handleStatusChange,
}) => {
  const { status, type, approval } = notification
  const isContributorRequest = type === "approval"

  return (
    <div className={styles.actions}>
      {isContributorRequest && (
        <>
          {approval !== "denied" && (
            <button
              className={`${styles.notificationapprove} ${
                approval === "accepted" ? styles.active : ""
              }`}
              onClick={() => handleProcessAction("accepted")}
              disabled={approval === "accepted" || isProcessing}
            >
              <i className="fa fa-check" />{" "}
              {approval === "accepted" ? "Approved" : "Approve"}
            </button>
          )}

          {approval !== "accepted" && (
            <button
              className={`${styles.notificationdeny} ${
                approval === "denied" ? styles.active : ""
              }`}
              onClick={() => handleProcessAction("denied")}
              disabled={approval === "denied" || isProcessing}
            >
              <i className="fa fa-times" />{" "}
              {approval === "denied" ? "Denied" : "Deny"}
            </button>
          )}
        </>
      )}

      {status === "unread" && (
        <>
          <StatusActionButton
            status={status}
            targetStatus="saved"
            iconSrc={iconUnread}
            altText="Icon indicating unread status"
            tooltipText="Save and mark as read"
            srText="Save"
            onClick={handleStatusChange}
            disabled={isProcessing}
            className={styles.save}
          />
          <StatusActionButton
            status={status}
            targetStatus="archived"
            iconSrc={iconArchived}
            altText="Icon indicating archived status"
            tooltipText="Archive"
            srText="Archive"
            onClick={handleStatusChange}
            disabled={isProcessing}
            className={styles.archive}
          />
        </>
      )}

      {status === "saved" && (
        <>
          <StatusActionButton
            status={status}
            targetStatus="unread"
            iconSrc={iconSaved}
            altText="Icon indicating saved status"
            tooltipText="Mark as Unread"
            srText="Mark as Unread"
            onClick={handleStatusChange}
            disabled={isProcessing}
            className={styles.unread}
          />
          <StatusActionButton
            status={status}
            targetStatus="archived"
            iconSrc={iconArchived}
            altText="Icon indicating archived status"
            tooltipText="Archive"
            srText="Archive"
            onClick={handleStatusChange}
            disabled={isProcessing}
            className={styles.archive}
          />
        </>
      )}

      {status === "archived" && (
        <StatusActionButton
          status={status}
          targetStatus="unread"
          iconSrc={iconUnread}
          altText="Icon indicating unread status"
          tooltipText="Mark as Unread"
          srText="Unarchive"
          onClick={handleStatusChange}
          disabled={isProcessing}
          className={styles.unarchive}
        />
      )}
    </div>
  )
}
