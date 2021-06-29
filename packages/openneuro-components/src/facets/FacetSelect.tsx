import React from 'react'
import { AccordionTab, AccordionTabStyle } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import './facet.scss'

export type FacetSelectValueType =
  | { label: string; value: string }
  | string
  | null

export interface FacetSelectProps {
  // items may be a list of objects with labels and values
  //   or a simple array of strings, where the string is used for both their labels and values
  items: (
    | string
    | {
        label: string
        value: string
        count?: number
        children?: null | { label: string; value: string; count: number }[]
      }
  )[]
  accordionStyle: AccordionTabStyle
  startOpen: boolean
  label: string
  dropdown?: boolean
  selected: FacetSelectValueType
  setSelected: (selected: FacetSelectValueType) => void
  className?: string
  noAccordion?: boolean
}

const get = (obj, property) => (typeof obj === 'object' ? obj[property] : obj)
export const check = (obj, property) =>
  typeof obj === 'object' && typeof obj[property] === 'number'
    ? obj[property].toLocaleString()
    : typeof obj === 'object'
    ? obj[property]
    : false

export const FacetSelect = ({
  items,
  selected,
  setSelected,
  startOpen,
  label,
  accordionStyle,
  dropdown,
  className,
  noAccordion,
}: FacetSelectProps) => {
  const setSelectorNoPropagation = (e, value) => {
    e.stopPropagation()
    setSelected(value)
  }
  return (
    <>
      {noAccordion ? (
        <div className={className + ' facet-accordion'}>
          <h2>{label}</h2>
          <div className="facet-list">
            <ul className="level-1">
              {items.map((item, index) => (
                <li
                  key={index}
                  onClick={e => setSelectorNoPropagation(e, get(item, 'value'))}
                  className={
                    selected && selected == get(item, 'value')
                      ? 'selected-facet facet'
                      : 'facet'
                  }>
                  <span className="label">
                    {get(item, 'label')}
                    {check(item, 'count') && (
                      <span>({check(item, 'count')})</span>
                    )}
                  </span>
                  {check(item, 'children') && (
                    <ul className="level-2">
                      {get(item, 'children').map((item, index) => (
                        <li
                          key={index}
                          onClick={e => setSelectorNoPropagation(e, item.value)}
                          className={
                            selected && selected == item.value
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
        </div>
      ) : (
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
                    onClick={e =>
                      setSelectorNoPropagation(e, get(item, 'value'))
                    }
                    className={
                      selected && selected == get(item, 'value')
                        ? 'selected-facet facet'
                        : 'facet'
                    }>
                    <span className="label">
                      {get(item, 'label')}
                      {check(item, 'count') && (
                        <span>({get(item, 'count')})</span>
                      )}
                    </span>
                    {check(item, 'children') && (
                      <ul className="level-2">
                        {get(item, 'children').map((item, index) => (
                          <li
                            key={index}
                            onClick={e =>
                              setSelectorNoPropagation(e, get(item, 'value'))
                            }
                            className={
                              selected && selected == get(item, 'value')
                                ? 'selected-facet facet'
                                : 'facet'
                            }>
                            <span className="label">
                              {get(item, 'label')}
                              {check(item, 'count') && (
                                <span>({get(item, 'count')})</span>
                              )}
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
      )}
    </>
  )
}
