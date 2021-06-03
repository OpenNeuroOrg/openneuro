import React from 'react'
import { AccordionTab } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import './facet.scss'

export interface FacetSelectProps {
  items: {
    label: string
    value: string
    count?: number
    children?: null | { label: string; value: string; count: number }[]
  }[]
  accordionStyle: string
  startOpen: boolean
  label: string
  dropdown?: boolean
  selected: {
    label: string
    value: string
    count?: number
    children?: React.ReactNode
  }
  setSelected: (selected: { label: string; value: string }) => void
  className?: string
}

export const FacetSelect = ({
  items,
  selected,
  setSelected,
  startOpen,
  label,
  accordionStyle,
  dropdown,
  className,
}: FacetSelectProps) => {
  const setSelectorNoPropagation = (e, item) => {
    e.stopPropagation()
    setSelected(item)
  }
  return (
    <AccordionWrap className={className + ' facet-accordion'}>
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
                onClick={e => setSelectorNoPropagation(e, item)}
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
                        onClick={e => setSelectorNoPropagation(e, item)}
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
