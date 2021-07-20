import React from 'react'
import { AccordionTab, AccordionTabStyle } from '../accordion/AccordionTab'
import { AccordionWrap } from '../accordion/AccordionWrap'
import DateRangePicker from '@wojtekmaj/react-daterange-picker'

import { Icon } from '../icon/Icon'

export interface FacetDatePickerProps {
  accordionStyle: AccordionTabStyle
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
            calendarIcon={
              <Icon icon="far fa-calendar-alt" label="date range" />
            }
            clearIcon={<Icon icon="fas fa-times" label="clear" />}
          />
        </div>
      </AccordionTab>
    </AccordionWrap>
  )
}
