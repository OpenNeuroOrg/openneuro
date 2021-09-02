import React, { FC } from 'react'

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
  onClick?: (expanded?: boolean) => void
}

/**
 * Primary UI component for user interaction
 */
export const AccordionTab: FC<AccordionTabProps> = ({
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
  const fileTreeIcon = accordionStyle == 'file-tree' ? (
    <Icon
      className="file-icon"
      icon={isOpen ? 'fas fa-folder-open' : 'fas fa-folder'}
      // label="directory"
    />
  ) : null

  return (
    <>
      <span
        className={`${accordionStyle}` + ' accordion ' + `${className}`}
        id={id}>
        <div
          className={`accordion-title ${isOpen ? 'open' : ''}`}
          onClick={() => {
            onClick?.(!isOpen)
            setOpen(!isOpen)
          }}>
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
