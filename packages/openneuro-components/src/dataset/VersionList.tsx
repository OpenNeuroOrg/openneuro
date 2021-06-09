import React from 'react'
import { Dropdown } from '../dropdown/Dropdown'
import '../dropdown/dropdown.scss'
import './version-dropdown.scss'

export interface VersionListProps {
  items: {
    label: string
    value: string
    id: string
    tag: string
    created: Date
    deprecated: boolean
  }[]

  selected: string
  setSelected: (selected: string) => void
  className: string
  activeDataset: string
  dateModified: Date
}
const formatDate = dateObject =>
  new Date(dateObject).toISOString().split('T')[0]

export const VersionList = ({
  items,
  selected,
  setSelected,
  className,
  dateModified,
}: VersionListProps) => {
  return (
    <Dropdown
      className={className}
      label={
        <div className="version-list-label">
          <b>Versions</b>
          <i className="fas fa-plus" />
        </div>
      }
      children={
        <div className="version-list-dropdow">
          <ul>
            <li
              onClick={() => setSelected('draft')}
              className={selected === 'draft' && 'selected'}>
              <span className="label">Draft</span> {dateModified}
            </li>
            {items.map((item, index) => (
              <li
                key={index}
                onClick={() => setSelected(item.id)}
                className={selected === item.id && 'selected'}>
                {/* {selected.id === item.id && <i className="fas fa-check" />} */}
                <span className="label">
                  v{item.tag}
                  <span>{item.deprecated == true && 'Deprecated'}</span>
                </span>
                {formatDate(item.created)}
              </li>
            ))}
          </ul>
        </div>
      }
    />
  )
}
