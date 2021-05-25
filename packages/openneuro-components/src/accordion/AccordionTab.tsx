import React from 'react'

import { Icon } from '../icon/Icon'

import './accordion.scss'

export interface AccordionTabProps {
  children: React.ReactNode
  tabId: string
  className: string
  label: string
  plainStyle: boolean
  startOpen: boolean
  accordionStyle: 'plain' | 'file-tree' | 'bids-wrappper'
}

/**
 * Primary UI component for user interaction
 */
export const AccordionTab: React.FC<AccordionTabProps> = ({
  children,
  tabId,
  label,
  className,
  accordionStyle,
  startOpen,
}) => {
  const [isOpen, setOpen] = React.useState(startOpen)
  const fileTreeIcon = accordionStyle == 'file-tree' && (
    <Icon
      className="file-icon"
      icon={isOpen ? 'fas fa-folder-open' : 'fas fa-folder'}
    />
  )

  return (
    <>
      <span className={`${accordionStyle}` + ' ' + `${className}`} id={tabId}>
        <div
          className={`accordion-title ${isOpen ? 'open' : ''}`}
          onClick={() => setOpen(!isOpen)}>
          {fileTreeIcon} {label}
        </div>
        <div className={`accordion-item ${!isOpen ? 'collapsed' : ''}`}>
          <div className="accordion-content">{children}</div>
        </div>
      </span>
    </>
  )
}
