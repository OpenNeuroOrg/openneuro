import React, { useState } from "react"
import styles from "./scss/usernotifications.module.scss"
import { Tooltip } from "../components/tooltip/Tooltip"
import iconUnread from "../../assets/icon-unread.png"
import iconSaved from "../../assets/icon-saved.png"
import iconArchived from "../../assets/icon-archived.png"
import { MappedNotification } from "../types/user-types"

export const NotificationAccordion = ({ notification, onUpdate }: {
  notification: MappedNotification
  onUpdate: (id: string, updates: Partial<MappedNotification>) => void
}) => {
  const { id, title, content, status, type, approval } = notification

  const hasContent = content && content.trim().length > 0

  const [isOpen, setIsOpen] = useState(false)
  const toggleAccordion = () => setIsOpen(!isOpen)

  const handleApprovalChange = (approvalStatus: "accepted" | "denied") => {
    // TODO: This should trigger a GraphQL mutation to process the request on the backend.
    // E.g., call a 'processContributorRequest' mutation.
    onUpdate(id, { approval: approvalStatus }) // Updates local state for immediate feedback
  }

  const handleStatusChange = (newStatus: "unread" | "saved" | "archived") => {
    // TODO: This should trigger a GraphQL mutation to update a 'readStatus' field
    // on the backend DatasetEvent for persistence.
    onUpdate(id, { status: newStatus }) // Updates local state for immediate feedback
  }

  return (
    <li
      className={`${styles.notificationAccordion} ${isOpen ? styles.open : ""}`}
    >
      <div className={styles.header}>
        <h3 className={styles.accordiontitle}>{title}</h3>

        {hasContent && (
          <button className={styles.readbutton} onClick={toggleAccordion}>
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
          {type === "approval" && (
            <>
              {(approval !== "denied") && (
                <button
                  className={`${styles.notificationapprove} ${
                    approval === "accepted" || approval === "approved"
                      ? styles.active
                      : ""
                  }`}
                  onClick={() => handleApprovalChange("accepted")}
                  disabled={approval === "accepted" || approval === "approved"}
                >
                  <i className="fa fa-check"></i>{" "}
                  {approval === "accepted" || approval === "approved"
                    ? "Approved"
                    : "Approve"}
                </button>
              )}

              {(approval !== "accepted" && approval !== "approved") && (
                <button
                  className={`${styles.notificationdeny} ${
                    approval === "denied" ? styles.active : ""
                  }`}
                  onClick={() => handleApprovalChange("denied")}
                  disabled={approval === "denied"}
                >
                  <i className="fa fa-times"></i>{" "}
                  {approval === "denied" ? "Denied" : "Deny"}
                </button>
              )}
            </>
          )}
          {status === "unread" && (
            <>
              <Tooltip tooltip="Save and mark as read">
                <button
                  className={styles.save}
                  onClick={() => handleStatusChange("saved")}
                >
                  <img
                    className={`${styles.accordionicon} ${styles.saveicon}`}
                    src={iconUnread}
                    alt=""
                  />
                  <span className="sr-only">Save</span>
                </button>
              </Tooltip>
              <Tooltip tooltip="Archive">
                <button
                  className={styles.archive}
                  onClick={() => handleStatusChange("archived")}
                >
                  <img
                    className={`${styles.accordionicon} ${styles.archiveicon}`}
                    src={iconArchived}
                    alt=""
                  />
                  <span className="sr-only">Archive</span>
                </button>
              </Tooltip>
            </>
          )}
          {status === "saved" && (
            <>
              <Tooltip tooltip="Mark as Unread">
                <button
                  className={styles.unread}
                  onClick={() => handleStatusChange("unread")}
                >
                  <img
                    className={`${styles.accordionicon} ${styles.unreadicon}`}
                    src={iconSaved}
                    alt=""
                  />
                  <span className="sr-only">Mark as Unread</span>
                </button>
              </Tooltip>
              <Tooltip tooltip="Archive">
                <button
                  className={styles.archive}
                  onClick={() => handleStatusChange("archived")}
                >
                  <img
                    className={`${styles.accordionicon} ${styles.archiveicon}`}
                    src={iconArchived}
                    alt=""
                  />
                  <span className="sr-only">Archive</span>
                </button>
              </Tooltip>
            </>
          )}
          {status === "archived" && (
            <Tooltip tooltip="Mark as Unread">
              <button
                className={styles.unarchive}
                onClick={() => handleStatusChange("unread")}
              >
                <img
                  className={`${styles.accordionicon} ${styles.unreadicon}`}
                  src={iconUnread}
                  alt=""
                />
                <span className="sr-only">Unarchive</span>
              </button>
            </Tooltip>
          )}
        </div>
      </div>
      {isOpen && hasContent && (
        <div className={styles.accordionbody}>{content}</div>
      )}
    </li>
  )
}
