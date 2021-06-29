import React from 'react'
import { AccordionTab, AccordionTabStyle } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import { RadioGroup } from '../radio/RadioGroup'
import './facet.scss'

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
  accordionStyle: AccordionTabStyle
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
