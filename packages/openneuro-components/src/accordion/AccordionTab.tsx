import React from 'react'

import { Icon } from '../icon/Icon'

export type AccordionTabStyle = 'plain' | 'file-tree' | 'bids-wrapper'

export interface AccordionTabProps {
  children: React.ReactNode
  id?: string
  className?: string
  label: React.ReactNode
  startOpen?: boolean
  dropdown?: boolean
  accordionStyle: AccordionTabStyle
}

/**
 * Primary UI component for user interaction
 */
export const AccordionTab = ({
  children,
  id,
  label,
  className,
  accordionStyle,
  startOpen,
  dropdown,
}: AccordionTabProps) => {
  const [isOpen, setOpen] = React.useState(startOpen)
  const fileTreeIcon = accordionStyle == 'file-tree' && (
    <Icon
      className="file-icon"
      icon={isOpen ? 'fas fa-folder-open' : 'fas fa-folder'}
      label="directory"
    />
  )

  return (
    <>
      <span
        className={`${accordionStyle}` + ' accordion ' + `${className}`}
        id={id}>
        <div
          className={`accordion-title ${isOpen ? 'open' : ''}`}
          onClick={() => setOpen(!isOpen)}>
          {fileTreeIcon} {label}
        </div>
        <div
          className={`accordion-item ${!isOpen ? ' collapsed' : ''} ${
            dropdown ? ' dropdown-style' : ''
          }`}>
          <div className="accordion-content">{children}</div>
        </div>
      </span>
    </>
  )
}
