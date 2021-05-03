import React from 'react'
import './dropdown.scss'

export interface DropdownProps {
  label: Record<string, any>
  children
}

export const Dropdown = ({ children, label }: DropdownProps) => {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <div className="dropdown-wrapper" onClick={() => setOpen(!isOpen)}>
      <div
        className={`toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setOpen(!isOpen)}>
        <span>{label}</span>
      </div>
      <div className={`menu ${isOpen ? 'expanded' : 'collapsed'}`}>
        {children}
      </div>
    </div>
  )
}
