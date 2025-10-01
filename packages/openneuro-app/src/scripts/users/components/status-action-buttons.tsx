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
  onClick: (newStatus: "unread" | "saved" | "archived") => Promise<void>
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
}) => {
  const buttonClass = [styles[targetStatus], className].filter(Boolean).join(
    " ",
  )

  return (
    <Tooltip tooltip={tooltipText}>
      <button
        className={buttonClass}
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
}
