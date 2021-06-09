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
  setDeprecatedModalIsOpen: (boolean) => void
}
const formatDate = dateObject =>
  new Date(dateObject).toISOString().split('T')[0]

export const VersionList = ({
  items,
  selected,
  setSelected,
  className,
  dateModified,
  setDeprecatedModalIsOpen,
}: VersionListProps) => {
  const deprecatedItem = itemId => {
    setDeprecatedModalIsOpen(prevIsOpen => !prevIsOpen)
    setSelected(itemId)
  }
  return (
    <>
      <Dropdown
        className={className}
        label={
          <div className="version-list-label">
            <b>Versions</b>
            <i className="fas fa-chevron-up" />
            <i className="fas fa-chevron-down" />
          </div>
        }
        children={
          <div className="version-list-dropdow">
            <ul>
              <li
                onClick={() => setSelected('draft')}
                className={selected === 'draft' && 'selected'}>
                <span className="label">
                  Draft{' '}
                  <span className="active">{selected === 'draft' && '*'}</span>
                </span>{' '}
                {dateModified}
              </li>
              {items.map((item, index) => (
                <li
                  key={index}
                  onClick={
                    item.deprecated == true
                      ? () => deprecatedItem(item.id)
                      : () => setSelected(item.id)
                  }
                  className={selected === item.id && 'selected'}>
                  <span className="label">
                    v{item.tag}
                    <span className="active">
                      {selected === item.id && '*'}
                    </span>
                    <span className="deprecated">
                      {item.deprecated == true && 'Deprecated'}
                    </span>
                  </span>
                  {formatDate(item.created)}
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </>
  )
}
