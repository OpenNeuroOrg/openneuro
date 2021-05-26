import React from 'react'
import { AccordionTab } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
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
  accordionStyle: string
  startOpen: boolean
  label: string
  dropdown: boolean
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
  startOpen,
  label,
  accordionStyle,
  dropdown,
}: FacetListWrapProps) => {
  const setSetter = (e, item) => {
    e.stopPropagation() // Stop this click event to trigger click on parent onClick()
    setSelected(item)
  }
  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle={accordionStyle}
        label={label}
        startOpen={startOpen}
        dropdown={dropdown}>
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
      </AccordionTab>
    </AccordionWrap>
  )
}
