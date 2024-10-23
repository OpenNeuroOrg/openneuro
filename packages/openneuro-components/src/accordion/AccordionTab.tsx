import React from "react"

import { Icon } from "../icon/Icon"

export type AccordionTabStyle = "plain" | "file-tree" | "bids-wrapper"

export interface AccordionTabProps {
  children: React.ReactNode
  id?: string
  className?: string
  label: string | number | React.ReactNode
  startOpen?: boolean
  dropdown?: boolean
  accordionStyle: AccordionTabStyle
  onClick?: (expanded?: boolean) => void
}

/**
 * Primary UI component for user interaction
 */
export const AccordionTab: React.FC<AccordionTabProps> = ({
  children,
  id,
  label,
  className,
  accordionStyle,
  startOpen,
  dropdown,
  onClick,
}) => {
  const [isOpen, setOpen] = React.useState(startOpen)
  const fileTreeIcon = accordionStyle == "file-tree"
    ? (
      <Icon
        className="file-icon"
        icon={isOpen ? "fas fa-folder-open" : "fas fa-folder"}
        label={label}
      />
    )
    : null

  return (
    <article
      className={`${accordionStyle || ""}` + " accordion " +
        `${className || ""}`}
      id={id}
    >
      <div
        className={`accordion-title ${isOpen ? "open" : ""}`}
        role="switch"
        onClick={() => {
          onClick?.(!isOpen)
          setOpen(!isOpen)
        }}
      >
        {fileTreeIcon || label}
      </div>
      <div
        className={`accordion-item ${!isOpen ? " collapsed" : ""} ${
          dropdown ? " dropdown-style" : ""
        }`}
      >
        <div className="accordion-content">{children}</div>
      </div>
    </article>
  )
}
