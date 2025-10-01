import React from "react"
import { Username } from "./username"
import type { User } from "../types/user-types"

interface NotificationBodyContentProps {
  content?: string
  isContributorRequest: boolean
  isContributorResponse: boolean
  approval?: "pending" | "accepted" | "denied"
  requesterUser?: User
  adminUser?: User
  targetUser?: User
  targetUserLoading: boolean
  reason?: string
}

export const NotificationBodyContent: React.FC<NotificationBodyContentProps> = (
  {
    content,
    isContributorRequest,
    isContributorResponse,
    approval,
    requesterUser,
    adminUser,
    targetUser,
    targetUserLoading,
    reason,
  },
) => {
  if (isContributorRequest) {
    if (approval === "accepted") {
      return (
        <p>
          Contributor request from <Username user={requesterUser} /> was{" "}
          <strong>approved</strong>.
        </p>
      )
    } else if (approval === "denied") {
      return (
        <p>
          Contributor request from <Username user={requesterUser} /> was{" "}
          <strong>denied</strong>.
        </p>
      )
    }
    return (
      <p>
        <Username user={requesterUser} />{" "}
        requested contributor status for this dataset.
      </p>
    )
  } else if (isContributorResponse) {
    return (
      <>
        <Username user={adminUser} /> {approval} contributor request
        {targetUserLoading ? <span>for ...</span> : (
          <>
            {" "}for <Username user={targetUser} />
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
      </>
    )
  }
  return <>{content}</>
}
