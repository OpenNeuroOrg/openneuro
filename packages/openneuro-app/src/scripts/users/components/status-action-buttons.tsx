import React from "react"
import { Tooltip } from "../../components/tooltip/Tooltip"
import styles from "../scss/usernotifications.module.scss"

interface StatusActionButtonProps {
  status: "unread" | "saved" | "archived"
  targetStatus: "unread" | "saved" | "archived"
  iconSrc: string
  altText: string
  tooltipText: string
  srText: string
  onClick: (newStatus: "unread" | "saved" | "archived") => void
  disabled: boolean
  className?: string
}

export const StatusActionButton: React.FC<StatusActionButtonProps> = ({
  targetStatus,
  iconSrc,
  altText,
  tooltipText,
  srText,
  onClick,
  disabled,
  className,
}) => (
  <Tooltip tooltip={tooltipText}>
    <button
      className={`${styles[targetStatus]} ${className || ""}`}
      onClick={() => onClick(targetStatus)}
      disabled={disabled}
    >
      <img
        className={`${styles.accordionicon} ${styles[`${targetStatus}icon`]}`}
        src={iconSrc}
        alt={altText}
      />
      <span className="sr-only">{srText}</span>
    </button>
  </Tooltip>
)
