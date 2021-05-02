import React from 'react'
import './dropdown.scss'

export interface DropdownProps {
  label: string
  items: [
    {
      label: string
      icon: string
      onClick: () => void
    },
  ]
}

export const Dropdown = ({ items }: DropdownProps) => {
  const [isOpen, setOpen] = React.useState(false)
  return (
    <div className="dropdown-menu" onBlur={() => setOpen(!isOpen)}>
      <div
        className={`toggle ${isOpen ? 'active' : ''}`}
        onClick={() => setOpen(!isOpen)}>
        <span>{label}</span>
      </div>
      <div className={`menu ${isOpen ? 'expanded' : 'collapsed'}`}>
        <ul>
          {items.map((i, index) => (
            <li key={index} onClick={i.onClick}>
              <span>
                <i className={i.icon} />
              </span>
              <span className="label">{i.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
