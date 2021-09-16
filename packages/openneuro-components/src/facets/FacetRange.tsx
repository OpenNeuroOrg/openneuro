import React from 'react'

import { TwoHandleRange } from '../range/TwoHandleRange'

export interface FacetRangeProps {
  min: number
  max: number
  step: number
  value: [number | null, number | null]
  onChange: (newvalue) => void
  uncappedMax?: boolean
}

export const FacetRange = ({
  min,
  max,
  step,
  value,
  onChange,
  uncappedMax,
}: FacetRangeProps) => {
  return (
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
  )
}
