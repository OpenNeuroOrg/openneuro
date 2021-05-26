import React from 'react'
import './facet.scss'

export interface FacetListWrapProps {
  items: [
    {
      label: string
      value: string
      count: number
      children: React.ReactNode
    },
  ]
  selected: {
    label: string
    value: string
    count: number
    children: React.ReactNode
  }
  setSelected: (selected: { label: string; value: string }) => void
}

export const FacetListWrap = ({
  items,
  selected,
  setSelected,
}: FacetListWrapProps) => {
  const setSetter = (e, item) => {
    e.stopPropagation() // Stop this click event to trigger click on parent onClick()
    setSelected(item)
  }
  return (
    <div className="facet-list">
      <ul className="level-1">
        {items.map((item, index) => (
          <li
            key={index}
            onClick={e => setSetter(e, item)}
            className={
              selected && selected.value == item.value
                ? 'selected-facet facet'
                : 'facet'
            }>
            <span className="label">
              {item.label}
              {item.count && <span>({item.count})</span>}
            </span>
            {item.children && (
              <ul className="level-2">
                {item.children.map((item, index) => (
                  <li
                    key={index}
                    onClick={e => setSetter(e, item)}
                    className={
                      selected && selected.value == item.value
                        ? 'selected-facet facet'
                        : 'facet'
                    }>
                    <span className="label">
                      {item.label}
                      {item.count && <span>({item.count})</span>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
