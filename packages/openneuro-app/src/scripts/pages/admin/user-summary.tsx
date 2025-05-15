import React from "react"
import parseISO from "date-fns/parseISO"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { formatDate } from "../../utils/date.js"
import { User } from "../../types/user-types"
import styles from "./users.module.scss"
import { Tooltip } from "../../components/tooltip/Tooltip"
import { UserTools } from "./user-tools.js"

interface UserSummaryProps {
  user: User
  refetch: (variables?: Record<string, any>) => void
}

const UserSummary = ({ user, refetch }: UserSummaryProps) => {
  const adminBadge = user.admin
    ? (
      <Tooltip tooltip="Admin">
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
    <div className={styles.gridRow}>
      <div className={`${styles.gtCell} ${styles.colLarge}`}>
        <h3>
          {user.name}
          {adminBadge && adminBadge}
          {blockedBadge}
          <br />
          {user.provider}
        </h3>
      </div>

      <div className={`${styles.gtCell} ${styles.colLarge}`}>
        {user.email && userEmail}
      </div>
      <div className={`${styles.gtCell} ${styles.colLarge}`}>
        {user.orcid && userOrcid}
      </div>
      <div className={`${styles.gtCell} ${styles.colSmall}`}>
        <>
          {formatDate(user.created)}
          <br />Created:
        </>
      </div>
      <div className={`${styles.gtCell} ${styles.colSmall}`}>
        {user.modified !== null && (
          <>
            {formatDistanceToNow(parseISO(user.modified))} ago
            <br />
            Modified:
          </>
        )}
      </div>
      <div className={`${styles.gtCell} ${styles.colSmall}`}>
        {user.lastSeen !== null && (
          <>
            {formatDistanceToNow(parseISO(user.lastSeen))} ago
            <br />
            Last Login:
          </>
        )}
      </div>
      <div className={`${styles.gtCell} ${styles.colFlex}`}>
        <UserTools user={user} refetch={refetch} />
      </div>
    </div>
  )
}

export default UserSummary
