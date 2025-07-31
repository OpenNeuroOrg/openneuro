import React, { useCallback, useState } from "react"
import { toast } from "react-toastify"
import * as Sentry from "@sentry/react"
import styles from "./scss/usernotifications.module.scss"
import type { MappedNotification } from "../types/user-types"
import { useMutation, useQuery } from "@apollo/client"
import { PROCESS_CONTRIBUTOR_REQUEST_MUTATION } from "../queries/datasetEvents.js"
import { GET_USER } from "../queries/user"
import { NotificationHeader } from "./user-notification-accordion-header"
import { NotificationBodyContent } from "./user-notifications-accordion-body"
import { NotificationReasonInput } from "./user-notification-reason-input"
import { NotificationActionButtons } from "./user-notification-accordion-actions"

import ToastContent from "../common/partials/toast-content.jsx"

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
    // status, // Not used - TODO
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
  } = useQuery(GET_USER, {
    variables: { userId: targetUserId },
    skip: !targetUserId,
  })

  const targetUser = targetUserData?.user
  const hasContent = content && content.trim().length > 0

  const [isOpen, setIsOpen] = useState(false)
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [reasonInput, setReasonInput] = useState("")
  const [currentApprovalAction, setCurrentApprovalAction] = useState<
    "accepted" | "denied" | null
  >(null)
  const [_localError, setLocalError] = useState<string | null>(null)
  const [processContributorRequest, { loading: processRequestLoading }] =
    useMutation(PROCESS_CONTRIBUTOR_REQUEST_MUTATION)
  const isProcessing = processRequestLoading || targetUserLoading

  const toggleAccordion = useCallback(() => {
    setIsOpen((prev) => !prev)
    if (isOpen) {
      setShowReasonInput(false)
      setReasonInput("")
      setCurrentApprovalAction(null)
      setLocalError(null)
    }
  }, [isOpen])

  const handleProcessAction = useCallback((action: "accepted" | "denied") => {
    setIsOpen(true)
    setShowReasonInput(true)
    setReasonInput("")
    setCurrentApprovalAction(action)
    setLocalError(null)
  }, [])

  const handleReasonSubmit = useCallback(async () => {
    if (!reasonInput.trim()) {
      const errorMessage = "Please provide a reason for this action."
      toast.error(<ToastContent title="Reason Required" body={errorMessage} />)
      setLocalError(errorMessage)
      return
    }

    if (isProcessing || !currentApprovalAction) {
      // ? add a toast here if this state is reached unexpectedly
      return
    }

    if (!datasetId || !requestId || !targetUserId) {
      const missingDataError =
        "Missing required data for processing contributor request."
      Sentry.captureException(missingDataError)
      toast.error(<ToastContent title="Missing Data" body={missingDataError} />)
      setLocalError(missingDataError)
      return
    }

    setLocalError(null)

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
      toast.success(
        <ToastContent
          title="Contributor Request Processed"
          body={`Request has been ${currentApprovalAction}.`}
        />,
      )

      onUpdate(id, { approval: currentApprovalAction, reason: reasonInput })
      setShowReasonInput(false)
      setReasonInput("")
      setCurrentApprovalAction(null)
    } catch (error) {
      const errorMessage = `Error processing contributor request: ${
        error.message || "Unknown error"
      }`
      Sentry.captureException(error)
      toast.error(
        <ToastContent title="Processing Failed" body={errorMessage} />,
      )
      setLocalError(errorMessage)
    }
  }, [
    reasonInput,
    isProcessing,
    currentApprovalAction,
    datasetId,
    requestId,
    targetUserId,
    processContributorRequest,
    onUpdate,
    id,
  ])

  const handleReasonCancel = useCallback(() => {
    setShowReasonInput(false)
    setReasonInput("")
    setCurrentApprovalAction(null)
    setLocalError(null)
  }, [])

  const showReviewButton = hasContent || isContributorRequest ||
    isContributorResponse

  return (
    <li
      className={`${styles.notificationAccordion} ${isOpen ? styles.open : ""}`}
    >
      <NotificationHeader
        title={title}
        datasetId={datasetId}
        isOpen={isOpen}
        toggleAccordion={toggleAccordion}
        showReviewButton={showReviewButton}
        isProcessing={isProcessing}
      >
        <NotificationActionButtons
          notification={notification}
          isProcessing={isProcessing}
          onUpdate={onUpdate}
          setError={setLocalError}
          handleProcessAction={handleProcessAction}
        />
      </NotificationHeader>

      {isOpen && (
        <div className={styles.accordionbody}>
          {showReasonInput
            ? (
              <NotificationReasonInput
                reasonInput={reasonInput}
                setReasonInput={setReasonInput}
                currentApprovalAction={currentApprovalAction}
                handleReasonCancel={handleReasonCancel}
                handleReasonSubmit={handleReasonSubmit}
                isProcessing={isProcessing}
              />
            )
            : (
              <NotificationBodyContent
                content={content}
                isContributorRequest={isContributorRequest}
                isContributorResponse={isContributorResponse}
                approval={approval}
                requesterUser={requesterUser}
                adminUser={adminUser}
                targetUser={targetUser}
                targetUserLoading={targetUserLoading}
                reason={reason}
              />
            )}
        </div>
      )}
    </li>
  )
}
