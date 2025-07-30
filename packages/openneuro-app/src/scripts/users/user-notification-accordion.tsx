import React, { useCallback, useState } from "react"
import styles from "./scss/usernotifications.module.scss"
import { Tooltip } from "../components/tooltip/Tooltip"
import iconUnread from "../../assets/icon-unread.png"
import iconSaved from "../../assets/icon-saved.png"
import iconArchived from "../../assets/icon-archived.png"
import { MappedNotification, User } from "../types/user-types"
import { gql, useMutation, useQuery } from "@apollo/client"
import { Username } from "./username"
import {
  PROCESS_CONTRIBUTOR_REQUEST_MUTATION,
  UPDATE_NOTIFICATION_STATUS_MUTATION,
} from "../queries/datasetEvents.js"
import { GET_USER } from "../queries/user"

// helper component for status buttons
interface StatusActionButtonProps {
  status: "unread" | "saved" | "archived"
  targetStatus: "unread" | "saved" | "archived"
  iconSrc: string
  altText: string
  tooltipText: string
  srText: string
  onClick: (newStatus: "unread" | "saved" | "archived") => void
  disabled: boolean
  className?: string
}

const StatusActionButton: React.FC<StatusActionButtonProps> = ({
  status,
  targetStatus,
  iconSrc,
  altText,
  tooltipText,
  srText,
  onClick,
  disabled,
  className,
}) => (
  <Tooltip tooltip={tooltipText}>
    <button
      className={`${styles[targetStatus]} ${className || ""}`}
      onClick={() => onClick(targetStatus)}
      disabled={disabled}
    >
      <img
        className={`${styles.accordionicon} ${styles[`${targetStatus}icon`]}`}
        src={iconSrc}
        alt={altText}
      />
      <span className="sr-only">{srText}</span>
    </button>
  </Tooltip>
)

export const NotificationAccordion = ({
  notification,
  onUpdate,
}: {
  notification: MappedNotification
  onUpdate: (id: string, updates: Partial<MappedNotification>) => void
}) => {
  const {
    id,
    title,
    content,
    status,
    type,
    approval,
    datasetId,
    requestId,
    targetUserId,
    requesterUser,
    adminUser,
    reason,
  } = notification

  const isContributorRequest = type === "approval"
  const isContributorResponse = type === "response"

  const {
    data: targetUserData,
    loading: targetUserLoading,
    error: targetUserError,
  } = useQuery(GET_USER, {
    variables: { userId: targetUserId },
    skip: !targetUserId, // Skip the query if targetUserId is null or undefined
  })

  const targetUser = targetUserData?.user
  const hasContent = content && content.trim().length > 0
  const [isOpen, setIsOpen] = useState(false)
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [reasonInput, setReasonInput] = useState("")
  const [currentApprovalAction, setCurrentApprovalAction] = useState<
    "accepted" | "denied" | null
  >(null)
  const [error, setError] = useState<string | null>(null)

  const toggleAccordion = useCallback(() => {
    setIsOpen((prev) => !prev)
    if (isOpen) {
      setShowReasonInput(false)
      setReasonInput("")
      setCurrentApprovalAction(null)
      setError(null)
    }
  }, [isOpen])

  const [
    processContributorRequest,
    { loading: processRequestLoading },
  ] = useMutation(PROCESS_CONTRIBUTOR_REQUEST_MUTATION)

  const [
    updateNotificationStatus,
    { loading: updateStatusLoading },
  ] = useMutation(UPDATE_NOTIFICATION_STATUS_MUTATION)

  const isProcessing = updateStatusLoading || processRequestLoading ||
    targetUserLoading // Corrected isProcessing

  const handleProcessAction = useCallback((action: "accepted" | "denied") => {
    setIsOpen(true)
    setShowReasonInput(true)
    setReasonInput("")
    setCurrentApprovalAction(action)
    setError(null)
  }, [])

  const handleReasonSubmit = useCallback(async () => {
    if (isProcessing || !currentApprovalAction) return

    if (!datasetId || !requestId || !targetUserId) {
      const missingDataError =
        "Missing required data for processing contributor request."
      console.error(missingDataError, { datasetId, requestId, targetUserId })
      setError(missingDataError)
      return
    }

    try {
      await processContributorRequest({
        variables: {
          datasetId,
          requestId,
          targetUserId,
          status: currentApprovalAction,
          reason: reasonInput,
        },
      })
      onUpdate(id, { approval: currentApprovalAction, reason: reasonInput })
      setShowReasonInput(false)
      setReasonInput("")
      setCurrentApprovalAction(null)
      setError(null)
    } catch (err: any) {
      const errorMessage = `Error processing contributor request: ${
        err.message || "Unknown error"
      }`
      console.error(errorMessage, err)
      setError(errorMessage)
    }
  }, [
    isProcessing,
    currentApprovalAction,
    datasetId,
    requestId,
    targetUserId,
    processContributorRequest,
    onUpdate,
    id,
    reasonInput,
  ])

  const handleReasonCancel = useCallback(() => {
    setShowReasonInput(false)
    setReasonInput("")
    setCurrentApprovalAction(null)
    setError(null)
  }, [])

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
    } catch (err: any) {
      const errorMessage = `Error updating notification status: ${
        err.message || "Unknown error"
      }`
      console.error(errorMessage, err)
      setError(errorMessage)
    }
  }, [isProcessing, id, updateNotificationStatus, onUpdate])

  let accordionBodyContent: React.ReactNode = content

  if (isContributorRequest) {
    accordionBodyContent = (
      <p>
        <Username user={requesterUser} />{" "}
        requested contributor status for this dataset.
      </p>
    )
    if (approval === "accepted") {
      accordionBodyContent = (
        <p>
          Contributor request from <Username user={requesterUser} /> was{" "}
          <strong>approved</strong>.
        </p>
      )
    } else if (approval === "denied") {
      accordionBodyContent = (
        <p>
          Contributor request from <Username user={requesterUser} /> was{" "}
          <strong>denied</strong>.
        </p>
      )
    }
  } else if (isContributorResponse) {
    accordionBodyContent = (
      <p>
        Admin: <Username user={adminUser} /> {approval} contributor request
        {targetUserLoading ? <span>for ...</span> : (
          <>
            for <Username user={targetUser} />
            {" "}
          </>
        )}
        <div>
          <small>
            {" Reason:"}
            <br />
            {reason || "No reason provided."}
          </small>
        </div>
      </p>
    )
  }
  return (
    <li
      className={`${styles.notificationAccordion} ${isOpen ? styles.open : ""}`}
    >
      <div className={styles.header}>
        <h3 className={styles.accordiontitle}>{title}</h3>

        {(hasContent || isContributorRequest || isContributorResponse) && (
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
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
        </div>
      </div>
      {isOpen && (
        <div className={styles.accordionbody}>
          {showReasonInput
            ? (
              <div className={styles.reasonInputContainer}>
                <textarea
                  value={reasonInput}
                  onChange={(e) => setReasonInput(e.target.value)}
                  placeholder={`Reason for ${currentApprovalAction}... (optional)`}
                  rows={3}
                  className={styles.reasonTextarea}
                />
                <div className={styles.reasonButtons}>
                  <button
                    className={styles.reasonCancelButton}
                    onClick={handleReasonCancel}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.reasonSaveButton}
                    onClick={handleReasonSubmit}
                    disabled={isProcessing}
                  >
                    Save
                  </button>
                </div>
              </div>
            )
            : accordionBodyContent}
        </div>
      )}
    </li>
  )
}
