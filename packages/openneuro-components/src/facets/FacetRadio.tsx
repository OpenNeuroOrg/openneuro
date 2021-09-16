import React from 'react'

import { RadioGroup } from '../radio/RadioGroup'

export interface FacetRadioProps {
  // if radioArr is string[]
  // then the string items are both the label and value for the radio buttons
  radioArr: (
    | string
    | {
        label: string
        onChange?: React.MouseEventHandler<HTMLInputElement>
        value: string
      }
  )[]
  layout: string
  name: string
  selected: string
  setSelected: (value) => void
  className?: string
}

export const FacetRadio = ({
  radioArr,
  layout,
  name,
  selected,
  setSelected,
  className,
}: FacetRadioProps) => {
  return (
    <div className="facet-radio">
      <RadioGroup
        setSelected={setSelected}
        selected={selected}
        name={name}
        radioArr={radioArr}
        layout={layout}
      />
    </div>
  )
}
