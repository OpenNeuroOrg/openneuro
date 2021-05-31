import React from 'react'

import { Icon } from '../icon/Icon'

import './accordion.scss'

export interface AccordionTabProps {
  children: React.ReactNode
  id: string
  className: string
  label: string
  startOpen?: boolean
  dropdown?: boolean
  accordionStyle: 'plain' | 'file-tree' | 'bids-wrappper'
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
      <span className={`${accordionStyle}` + ' ' + `${className}`} id={id}>
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
