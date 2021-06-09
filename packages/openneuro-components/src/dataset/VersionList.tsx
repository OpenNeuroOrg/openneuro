import React from 'react'
import { Dropdown } from '../dropdown/Dropdown'
import '../dropdown/dropdown.scss'

export interface VersionListProps {
  items: {
    label: string
    value: string
    id: string
    tag: string
    created: Date
    deprecated: boolean
  }[]

  selected: {
    label: string
    value: string
    id: string
    tag: string
    created: Date
    deprecated: boolean
  }
  setSelected: (selected: {
    label: string
    value: string
    id: string
    tag: string
    created: Date
    deprecated: boolean
  }) => void
  className: string
}

export const VersionList = ({
  items,
  selected,
  setSelected,
  className,
}: VersionListProps) => {
  return (
    <Dropdown
      className={className}
      label={
        <div className="version-list-label">
          <b>Versions</b> {selected.label}
          <i className="fas fa-plus" />
        </div>
      }
      children={
        <div className="version-list-dropdow">
          <ul>
            {items.map((item, index) => (
              <li key={index} onClick={() => setSelected(item)}>
                {selected.id === item.id && <i className="fas fa-check" />}
                <span className="label">{item.label}</span>
                id:{item.id}
                <br />
                {/* {datasetId}<br /> */}
                tag:{item.tag}
                <br />
                Createed:{item.created}
                <br />
                {item.deprecated == true && 'Deprecated'}
                <br />
              </li>
            ))}
          </ul>
        </div>
      }
    />
  )
}
