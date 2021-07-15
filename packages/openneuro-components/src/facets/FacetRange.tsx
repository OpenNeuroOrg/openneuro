import React from 'react'
import { AccordionTab, AccordionTabStyle } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { TwoHandleRange } from '../range/TwoHandleRange'
import './facet.scss'

export interface FacetRangeProps {
  accordionStyle: AccordionTabStyle
  startOpen: boolean
  label: string
  dropdown?: boolean
  min: number
  max: number
  step: number
  value: [number | null, number | null]
  onChange: (newvalue) => void
}

export const FacetRange = ({
  startOpen,
  label,
  accordionStyle,
  dropdown,
  min,
  max,
  step,
  value,
  onChange,
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
            value={value}
            onChange={onChange}
          />
        </div>
      </AccordionTab>
    </AccordionWrap>
  )
}
