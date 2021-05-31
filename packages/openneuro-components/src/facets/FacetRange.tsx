import React from 'react'
import { AccordionTab } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { TwoHandleRange } from '../range/TwoHandleRange'
import './facet.scss'

export interface FacetRangeProps {
  accordionStyle: string
  startOpen: boolean
  label: string
  dropdown?: boolean
  min: number
  max: number
  step?: number
  dots?: boolean
  pushable?: boolean
  defaultValue: [number, number]
  marks?: { number: string }
  newvalue: [number, number]
  setNewValue: (newvalue) => void
}

export const FacetRange = ({
  startOpen,
  label,
  accordionStyle,
  dropdown,
  min,
  max,
  step,
  dots,
  pushable,
  defaultValue,
  marks,
  newvalue,
  setNewValue,
}: FacetRangeProps) => {
  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle={accordionStyle}
        label={label}
        startOpen={startOpen}
        dropdown={dropdown}>
        <div className="facet-range">
          <TwoHandleRange
            min={min}
            max={max}
            step={step}
            dots={dots}
            marks={marks}
            pushable={pushable}
            defaultValue={defaultValue}
            newvalue={newvalue}
            setNewValue={setNewValue}
          />
        </div>
      </AccordionTab>
    </AccordionWrap>
  )
}
