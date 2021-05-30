import React from 'react'
import { AccordionTab } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { RadioGroup } from '../radio/RadioGroup'
import './facet.scss'

export interface FacetRadioProps {
  radioArr: {
    label: string
    onChange?: React.MouseEventHandler<HTMLInputElement>
    checked: boolean
    value: string
  }[]
  layout: string
  name: string
  accordionStyle: string
  startOpen: boolean
  label: string
  dropdown?: boolean
  active: number
  setActive: (index) => void
}

export const FacetRadio = ({
  radioArr,
  layout,
  name,
  startOpen,
  label,
  accordionStyle,
  dropdown,
  active,
  setActive,
}: FacetRadioProps) => {
  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle={accordionStyle}
        label={label}
        startOpen={startOpen}
        dropdown={dropdown}>
        <div className="facet-radio">
          <RadioGroup
            setActive={setActive}
            active={active}
            name={name}
            radioArr={radioArr}
            layout={layout}
          />
        </div>
      </AccordionTab>
    </AccordionWrap>
  )
}
