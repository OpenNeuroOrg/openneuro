import React from 'react'
import { Dropdown } from './Dropdown'
import './dropdown.scss'

export interface DropdownListProps {
  items: [
    {
      label: string
      value: string
    },
  ]
  selected: {
    label: string
    value: string
  }
  setSelected: (selected: { label: string; value: string }) => void
}

export const DropdownList = ({
  items,
  selected,
  setSelected,
}: DropdownListProps) => {
  return (
    <Dropdown
      label={
        <div className="list-label">
          <b>SORT BY:</b> {selected.label}
          <i className="fas fa-exchange-alt fa-rotate-90" />
        </div>
      }>
      <div className="dropdown-list">
        <ul>
          {items.map((item, index) => (
            <li key={index} onClick={() => setSelected(item)}>
              {selected.value === item.value && <i className="fas fa-check" />}
              <span className="label">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </Dropdown>
  )
}
