import React from 'react'
import { Dropdown } from './Dropdown'
import './dropdown.scss'

export interface DropdownListProps {
  items: [
    {
      label: string
      icon: string
      onClick: () => void
      active: boolean
    },
  ]
}

export const DropdownList = ({ items }: DropdownListProps) => {
  return (
    <Dropdown
      label={
        <div className="list-label">
          <b>SORT BY:</b> Newest{' '}
          <i className="fas fa-exchange-alt fa-rotate-90" />{' '}
        </div>
      }>
      <div className="dropdown-list">
        <ul>
          {items.map((item, index) => (
            <li key={index} onClick={item.onClick}>
              {item.active ? <i className="fas fa-check" /> : null}
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </Dropdown>
  )
}
