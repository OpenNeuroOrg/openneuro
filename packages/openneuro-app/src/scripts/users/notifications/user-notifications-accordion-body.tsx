import React from "react"
import { Username } from "../username"
import type { MappedNotification } from "../../types/event-types"

interface NotificationBodyContentProps {
  notification: MappedNotification
}

export const NotificationBodyContent: React.FC<NotificationBodyContentProps> = (
  { notification },
) => {
  if (!notification) return null

  const { approval, needsReview, reason, requesterUser, adminUser, datasetId } =
    notification
  const event = notification.originalNotification.event
  const contributorData = event?.contributorData
  console.log(contributorData)
  console.log(notification.originalNotification.event)

  const targetUser = notification.targetUser ||
    notification.originalNotification.user

  const isContributorRequest = event?.type === "contributorRequest"
  const isContributorCitation = event?.type === "contributorCitation"
  const isContributorResponse = event?.type === "contributorRequestResponse" ||
    event?.type === "contributorCitationResponse"

  const renderContribInfo = () => {
    if (!contributorData) return null
    return (
      <div style={{ marginTop: "0.5em", paddingLeft: "1em" }}>
        <strong>Contributor Info:</strong>
        <div>Name: {contributorData.name || "-"}</div>
        <div>Given: {contributorData.givenName || "-"}</div>
        <div>Family: {contributorData.familyName || "-"}</div>
        <div>ORCID: {contributorData.orcid || "-"}</div>
        <div>Type: {contributorData.contributorType || "-"}</div>
      </div>
    )
  }

  if (needsReview && isContributorRequest) {
    return (
      <p>
        <Username user={requesterUser} />{" "}
        is requesting contributor status for this dataset.
        {renderContribInfo()}
      </p>
    )
  }

  if (needsReview && isContributorCitation) {
    return (
      <p>
        Admin of {datasetId} is requesting to add{" "}
        <Username user={targetUser} />.
        {renderContribInfo()}
      </p>
    )
  }

  if (approval === "accepted" && isContributorRequest) {
    return (
      <p>
        <Username user={requesterUser} />{" "}
        accepted request and the following info has been added to {datasetId}.
        {renderContribInfo()}
      </p>
    )
  }

  if (approval === "accepted" && isContributorResponse) {
    return (
      <p>
        Admin <Username user={adminUser} />{" "}
        has accepted request and the following info has been added to{" "}
        {datasetId}.
        {renderContribInfo()}
      </p>
    )
  }

  return <>{notification.content || "No additional details."}</>
}
