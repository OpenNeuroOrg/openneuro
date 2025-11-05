import React from "react"
import type { User } from "../../types/user-types"
import { Username } from "../username"
import styles from "./scss/usernotifications.module.scss"

interface NotificationHeaderProps {
  title: string
  isOpen: boolean
  type: string
  toggleAccordion: () => void
  isProcessing: boolean
  children?: React.ReactNode
  adminUser?: User
  requesterUser?: User
  targetUser?: User
  datasetId?: string
  resStatus?: string
}

export const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  title,
  isOpen,
  type,
  toggleAccordion,
  isProcessing,
  children,
  adminUser,
  requesterUser,
  targetUser,
  datasetId,
  resStatus,
}) => {
  const renderTitle = () => {
    if (datasetId) {
      const datasetLink = `/datasets/${datasetId}/`
      return (
        <span>
          <small>{type}:</small>
          <br />
          {type === "contributorCitation"
            ? (
              <>
                <Username user={adminUser} /> {title}{" "}
                <Username user={targetUser} />
                {" as a contributor to "}
              </>
            )
            : (
              <>
                {
                  /* {targetUser ? <Username user={targetUser}/> : <Username user={requesterUser}/>}{" "}{title}{" "}
          <a href={datasetLink} className={styles.titlelink}>
            {datasetId}
          </a>{" "}{resStatus} */
                }

                {targetUser
                  ? <Username user={targetUser} />
                  : <Username user={requesterUser} />} {title}
                {" "}
              </>
            )}
          <a href={datasetLink} className={styles.titlelink}>
            {datasetId}
          </a>{" "}
          {type != "contributorCitation" ? resStatus : ""}
        </span>
      )
    }
    return title
  }
  return (
    <div className={styles.header}>
      <h3 className={styles.accordiontitle}>{renderTitle()}</h3>
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
      {children}
    </div>
  )
}
