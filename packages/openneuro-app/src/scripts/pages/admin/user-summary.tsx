// UserSummary.js

import React from "react"
import parseISO from "date-fns/parseISO"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { formatDate } from "../../utils/date.js" // Adjust the import path
import { User } from "../../types/user-types" // Adjust the import path
import styles from "./users.module.scss"
import { Tooltip } from "../../components/tooltip/Tooltip"

interface UserSummaryProps {
  user: User
}

const UserSummary = ({ user }: UserSummaryProps) => {
  const adminBadge = user.admin
    ? (
      <Tooltip tooltip="ADMIN">
        <span className={`${styles.badge} ${styles.admin}`}>
          <i className="fa fa-star"></i>
        </span>
      </Tooltip>
    )
    : null
  const blockedBadge = user.blocked
    ? (
      <Tooltip tooltip="Blocked">
        <span className={`${styles.badge} ${styles.blocked}`}>
          <i className="fa fa-lock"></i>
        </span>
      </Tooltip>
    )
    : (
      <Tooltip tooltip="Active">
        <span className={`${styles.badge}`}>
          <i className="fa fa-lock-open"></i>
        </span>
      </Tooltip>
    )
  const userEmail = <a href={`mailto:${user.email}`}>{user.email}</a>
  const userOrcid = <a href={`/user/${user.orcid}`}>{user.orcid}</a>
  return (
    <>
      <h3>
        {user.name}
        {adminBadge && adminBadge}
        {blockedBadge}
      </h3>
      {user.provider}:{" "}
      {user.email ? userEmail : user.orcid ? userOrcid : <span>{user.id}</span>}
      <br />
      <br />
      <div className={styles.summaryFooter}>
        <span>Created: {formatDate(user.created)}</span>
        {user.modified !== null && (
          <span>
            Modified: {formatDistanceToNow(parseISO(user.modified))} ago
          </span>
        )}
        {user.lastSeen !== null && (
          <span>
            Last Login: {formatDistanceToNow(parseISO(user.lastSeen))} ago
          </span>
        )}
      </div>
    </>
  )
}

export default UserSummary
