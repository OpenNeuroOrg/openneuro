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
  const [date, setDate] = React.useState()
  const deprecatedItem = (itemTag, itemCreated) => {
    setDeprecatedModalIsOpen(prevIsOpen => !prevIsOpen)
    setSelected(itemTag)
    setDate(formatDate(itemCreated))
  }
  const setVersion = (itemTag, itemCreated) => {
    setSelected(itemTag)
    setDate(formatDate(itemCreated))
  }

  return (
    <>
      <div className="active-version">
        <div>{selected === 'draft' ? 'Draft' : selected}</div>
        {selected === 'draft' ? 'Updated' : 'Created'}:{' '}
        {selected === 'draft' ? dateModified : 'version date'}
      </div>
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
                onClick={() => setVersion('draft', dateModified)}
                className={selected === 'draft' && 'selected'}>
                <span className="label">
                  Draft
                  <span className="active">{selected === 'draft' && '*'}</span>
                </span>
                {date}
              </li>
              {items.map((item, index) => (
                <li
                  key={index}
                  onClick={
                    item.deprecated == true
                      ? () => deprecatedItem(item.tag, item.created)
                      : () => setVersion(item.tag, formatDate(item.created))
                  }
                  className={selected === item.tag && 'selected'}>
                  <span className="label">
                    v{item.tag}
                    <span className="active">
                      {selected === item.tag && '*'}
                    </span>
                    <span className="deprecated">
                      {item.deprecated == true && 'Deprecated'}
                    </span>
                  </span>
                  {date}
                </li>
              ))}
            </ul>
          </div>
        }
      />
    </>
  )
}
