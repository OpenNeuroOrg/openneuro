import React from 'react'
import { AccordionTab } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'

import './facet.scss'
import { Icon } from '../icon/Icon'

export interface FacetDatePickerProps {
  accordionStyle: string
  startOpen: boolean
  label: string
  dropdown?: boolean
  selected: [Date | null, Date | null]
  setSelected: (value) => void
}

export const FacetDatePicker = ({
  startOpen,
  label,
  accordionStyle,
  dropdown,
  selected,
  setSelected,
}: FacetDatePickerProps) => {
  return (
    <AccordionWrap className="facet-accordion facet-date-picker">
      <AccordionTab
        accordionStyle={accordionStyle}
        label={label}
        startOpen={startOpen}
        dropdown={dropdown}>
        <div className="range-input">
          <DateRangePicker
            onChange={setSelected}
            value={selected}
            calendarIcon={<Icon icon="far fa-calendar-alt" />}
            clearIcon={<Icon icon="fas fa-times" />}
          />
        </div>
      </AccordionTab>
    </AccordionWrap>
  )
}
