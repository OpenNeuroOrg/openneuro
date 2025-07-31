import React, { useCallback } from "react"
import * as Sentry from "@sentry/react"
import { toast } from "react-toastify"
import { useMutation } from "@apollo/client"
import type { MappedNotification } from "../types/user-types"
import { UPDATE_NOTIFICATION_STATUS_MUTATION } from "../queries/datasetEvents"
import { StatusActionButton } from "./components/status-action-buttons"
import iconUnread from "../../assets/icon-unread.png"
import iconSaved from "../../assets/icon-saved.png"
import iconArchived from "../../assets/icon-archived.png"
import styles from "./scss/usernotifications.module.scss"
import ToastContent from "../common/partials/toast-content.jsx"

interface NotificationActionButtonsProps {
  notification: MappedNotification
  isProcessing: boolean
  onUpdate: (id: string, updates: Partial<MappedNotification>) => void
  setError: (error: string | null) => void
  handleProcessAction: (action: "accepted" | "denied") => void
}

export const NotificationActionButtons: React.FC<
  NotificationActionButtonsProps
> = ({
  notification,
  isProcessing,
  onUpdate,
  setError,
  handleProcessAction,
}) => {
  const {
    id,
    status,
    type,
    approval,
  } = notification

  const isContributorRequest = type === "approval"

  const [updateNotificationStatus] = useMutation(
    UPDATE_NOTIFICATION_STATUS_MUTATION,
  )

  // TODO just show errors for now
  const handleStatusChange = useCallback(async (
    newStatus: "unread" | "saved" | "archived",
  ) => {
    if (isProcessing) return

    try {
      const backendStatus = newStatus.toUpperCase()

      await updateNotificationStatus({
        variables: {
          datasetEventId: id,
          status: backendStatus,
        },
      })

      onUpdate(id, { status: newStatus })
      setError(null)
      toast.success(
        <ToastContent
          title="Notification Status Updated"
          body={`Notification marked as ${newStatus}.`}
        />,
      )
    } catch (error) {
      const errorMessage = `Error updating notification status: ${
        error.message || "Unknown error"
      }`
      Sentry.captureException(error)
      setError(errorMessage)
      toast.error(
        <ToastContent title="Status Update Failed" body={errorMessage} />,
      )
    }
  }, [isProcessing, id, updateNotificationStatus, onUpdate, setError])

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
              <i className="fa fa-check"></i>{" "}
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
              <i className="fa fa-times"></i>{" "}
              {approval === "denied" ? "Denied" : "Deny"}
            </button>
          )}
        </>
      )}
      {/* TODO Actually store status */}
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
