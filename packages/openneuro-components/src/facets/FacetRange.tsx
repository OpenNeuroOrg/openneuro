import React from 'react'
import { AccordionTab, AccordionTabStyle } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { TwoHandleRange } from '../range/TwoHandleRange'

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
  uncappedMax?: boolean
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
  uncappedMax,
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
            uncappedMax={uncappedMax}
          />
        </div>
      </AccordionTab>
    </AccordionWrap>
  )
}
