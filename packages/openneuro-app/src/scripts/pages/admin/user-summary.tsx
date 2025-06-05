import React from "react"
import parseISO from "date-fns/parseISO"
import formatDistanceToNow from "date-fns/formatDistanceToNow"
import { formatDate } from "../../utils/date.js"
import type { User } from "../../types/user-types"
import styles from "./users.module.scss"
import { Tooltip } from "../../components/tooltip/Tooltip"
import { UserTools } from "./user-tools.js"

interface UserSummaryProps {
  user: User
  refetchCurrentPage: () => void
}

const UserSummary = ({ user, refetchCurrentPage }: UserSummaryProps) => {
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
        </h3>
      </div>

      <div className={`${styles.gtCell} ${styles.colXLarge}`}>
        <div>{user.email && userEmail}</div>
        {user.orcid && userOrcid}
        <span>
          Provider:{" "}
          <b style={{ textTransform: "uppercase" }}>{user.provider}</b>
        </span>
      </div>
      <div className={`${styles.gtCell} ${styles.colSmall}`}>
        <>
          <div>
            <b>{formatDate(user.created)}</b>
          </div>
          Created
        </>
      </div>
      <div className={`${styles.gtCell} ${styles.colSmall}`}>
        {user.lastSeen !== null && (
          <>
            <div>
              <b>{formatDistanceToNow(parseISO(user.lastSeen))} ago</b>
            </div>
            Last Login
          </>
        )}
      </div>
      <div className={`${styles.gtCell} ${styles.colSmall}`}>
        {user.modified !== null && (
          <>
            <div>
              <b>{formatDistanceToNow(parseISO(user.modified))} ago</b>
            </div>
            Modified
          </>
        )}
      </div>

      <div className={`${styles.gtCell} ${styles.colFlex}`}>
        <UserTools
          user={user}
          refetchCurrentPage={refetchCurrentPage}
        />
      </div>
    </div>
  )
}

export default UserSummary
