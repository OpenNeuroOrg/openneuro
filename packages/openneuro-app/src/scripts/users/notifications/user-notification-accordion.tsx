import React, { useCallback, useState } from "react"
import * as Sentry from "@sentry/react"
import { toast } from "react-toastify"
import { useMutation, useQuery } from "@apollo/client"
import {
  PROCESS_CONTRIBUTOR_CITATION_MUTATION,
  PROCESS_CONTRIBUTOR_REQUEST_MUTATION,
  UPDATE_NOTIFICATION_STATUS_MUTATION,
} from "../../queries/datasetEvents"
import { GET_USER, useUser } from "../../queries/user"
import { NotificationHeader } from "./user-notification-accordion-header"
import { NotificationBodyContent } from "./user-notifications-accordion-body"
import { NotificationReasonInput } from "./user-notification-reason-input"
import { NotificationActionButtons } from "./user-notification-accordion-actions"
import ToastContent from "../../common/partials/toast-content"
import styles from "./scss/usernotifications.module.scss"

import type { MappedNotification } from "../../types/event-types"

export const NotificationAccordion = ({
  notification,
  onUpdate,
}: {
  notification: MappedNotification
  onUpdate: (id: string, updates: Partial<MappedNotification>) => void
}) => {
  const { user } = useUser()
  const {
    id,
    title,
    content,
    type,
    approval,
    datasetId,
    requestId,
    targetUserId,
  } = notification

  const isContributorRequest = type === "contributorRequest"
  const isContributorResponse = type === "contributorRequestResponse" ||
    type === "contributorCitationResponse"
  const isContributorCitation = type === "contributorCitation"

  const { data: targetUserData, loading: targetUserLoading } = useQuery(
    GET_USER,
    {
      variables: { userId: targetUserId },
      skip: !targetUserId,
    },
  )

  const targetUser = targetUserData?.user
  const hasContent = content && content.trim().length > 0

  const [isOpen, setIsOpen] = useState(false)
  const [showReasonInput, setShowReasonInput] = useState(false)
  const [reasonInput, setReasonInput] = useState("")
  const [currentApprovalAction, setCurrentApprovalAction] = useState<
    "accepted" | "denied" | null
  >(null)

  const [processContributorRequest, { loading: processRequestLoading }] =
    useMutation(PROCESS_CONTRIBUTOR_REQUEST_MUTATION)

  const [processContributorCitation] = useMutation(
    PROCESS_CONTRIBUTOR_CITATION_MUTATION,
  )

  const isProcessing = processRequestLoading || targetUserLoading

  const [updateNotificationStatus] = useMutation(
    UPDATE_NOTIFICATION_STATUS_MUTATION,
  )

  const toggleAccordion = useCallback(() => {
    setIsOpen((prev) => !prev)
    if (isOpen) {
      setShowReasonInput(false)
      setReasonInput("")
      setCurrentApprovalAction(null)
    }
  }, [isOpen])

  const handleProcessAction = useCallback((action: "accepted" | "denied") => {
    setIsOpen(true)
    setShowReasonInput(true)
    setReasonInput("")
    setCurrentApprovalAction(action)
  }, [])

  const handleReasonSubmit = useCallback(async () => {
    if (!reasonInput.trim()) {
      toast.error(
        <ToastContent
          title="Reason Required"
          body="Please provide a reason for this action."
        />,
      )
      return
    }

    if (isProcessing || !currentApprovalAction) return

    try {
      if (isContributorRequest) {
        if (!datasetId || !requestId || !targetUserId) {
          const err = "Missing required data for contributor request."
          Sentry.captureException(err)
          toast.error(<ToastContent title="Missing Data" body={err} />)
          return
        }

        await processContributorRequest({
          variables: {
            datasetId,
            requestId,
            targetUserId,
            resolutionStatus: currentApprovalAction,
            reason: reasonInput,
          },
        })

        toast.success(
          <ToastContent
            title="Contributor Request Processed"
            body={`Request has been ${currentApprovalAction}.`}
          />,
        )
      } else if (isContributorCitation) {
        const eventId = notification.originalNotification.id
        if (!eventId) {
          const err = "Contributor citation event not found."
          Sentry.captureException(err)
          toast.error(<ToastContent title="Missing Data" body={err} />)
          return
        }

        await processContributorCitation({
          variables: {
            eventId,
            status: currentApprovalAction,
            reason: reasonInput,
          },
        })

        toast.success(
          <ToastContent
            title="Contributor Citation Processed"
            body={`Citation has been ${currentApprovalAction}.`}
          />,
        )
      } else if (isContributorResponse) {
        // additional actions
      } else {
        console.warn("Unhandled notification type:", type)
      }

      setShowReasonInput(false)
      setReasonInput("")
      setCurrentApprovalAction(null)
    } catch (error: unknown) {
      const errorMessage = error instanceof Error
        ? error.message
        : "Unknown error"
      Sentry.captureException(error)
      toast.error(
        <ToastContent title="Processing Failed" body={errorMessage} />,
      )
    }
  }, [
    reasonInput,
    isProcessing,
    currentApprovalAction,
    datasetId,
    requestId,
    targetUserId,
    processContributorRequest,
    processContributorCitation,
    isContributorRequest,
    isContributorCitation,
    isContributorResponse,
    type,
    notification,
  ])

  const handleReasonCancel = useCallback(() => {
    setShowReasonInput(false)
    setReasonInput("")
    setCurrentApprovalAction(null)
  }, [])

  const handleStatusChange = useCallback(
    async (newStatus: "unread" | "saved" | "archived") => {
      onUpdate(id, { status: newStatus })

      try {
        const backendStatus = newStatus.toUpperCase()

        await updateNotificationStatus({
          variables: { eventId: id, status: backendStatus },
          refetchQueries: [{ query: GET_USER, variables: { userId: user.id } }],
        })

        toast.success(
          <ToastContent
            title="Update Successful"
            body={`Notification status changed to ${newStatus}.`}
          />,
        )
      } catch (error) {
        Sentry.captureException(error)
        toast.error(
          <ToastContent
            title="Update Failed"
            body="Failed to update notification status. Please try again."
          />,
        )
      }
    },
    [id, updateNotificationStatus, user, onUpdate],
  )

  return (
    <li
      className={`${styles.notificationAccordion} ${isOpen ? styles.open : ""}`}
    >
      <NotificationHeader
        title={title}
        datasetId={datasetId}
        isOpen={isOpen}
        toggleAccordion={toggleAccordion}
        isProcessing={isProcessing}
      >
        <NotificationActionButtons
          notification={notification}
          isProcessing={isProcessing}
          onUpdate={onUpdate}
          handleProcessAction={handleProcessAction}
          handleStatusChange={handleStatusChange}
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
            : <NotificationBodyContent notification={notification} />}
        </div>
      )}
    </li>
  )
}
