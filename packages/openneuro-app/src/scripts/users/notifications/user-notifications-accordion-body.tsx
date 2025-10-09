import React from "react"
import { Username } from "../username"
import type { User } from "../../types/user-types"

interface NotificationBodyContentProps {
  content?: string
  isContributorRequest: boolean
  isContributorResponse: boolean
  isCitationRequest: boolean
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
    isCitationRequest,
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
          <strong>Accepted</strong>.
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
  } else if (isCitationRequest) {
    return (
      <>
        {targetUserLoading ? <span>for ...</span> : (
          <>
            Sent to <Username user={targetUser} />
          </>
        )}
      </>
    )
  }
  return <>{content}</>
}
