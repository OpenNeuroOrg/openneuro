import React from 'react'
import { AccordionTab } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { RadioGroup } from '../radio/RadioGroup'
import './facet.scss'

export interface FacetRadioProps {
  radioArr: {
    label: string
    onChange?: React.MouseEventHandler<HTMLInputElement>
    value: string
  }[]
  layout: string
  name: string
  accordionStyle: string
  startOpen: boolean
  label: string
  dropdown?: boolean
  selected: string
  setSelected: (value) => void
  className?: string
}

export const FacetRadio = ({
  radioArr,
  layout,
  name,
  startOpen,
  label,
  accordionStyle,
  dropdown,
  selected,
  setSelected,
  className,
}: FacetRadioProps) => {
  return (
    <AccordionWrap className={className + ' facet-accordion'}>
      <AccordionTab
        accordionStyle={accordionStyle}
        label={label}
        startOpen={startOpen}
        dropdown={dropdown}>
        <div className="facet-radio">
          <RadioGroup
            setSelected={setSelected}
            selected={selected}
            name={name}
            radioArr={radioArr}
            layout={layout}
          />
        </div>
      </AccordionTab>
    </AccordionWrap>
  )
}
