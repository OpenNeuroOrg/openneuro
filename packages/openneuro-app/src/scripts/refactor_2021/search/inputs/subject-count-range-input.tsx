import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetRange } from '@openneuro/components/facets'
import { AccordionTab, AccordionWrap } from '@openneuro/components/accordion'

const SubjectCountRangeInput: FC = () => {
  const min = 0
  const max = 200
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const setSubjectRange = subjectCountRange => {
    setSearchParams(prevState => ({
      ...prevState,
      subjectCountRange: [
        (subjectCountRange[0] !== min && subjectCountRange[0]) || null,
        (subjectCountRange[1] !== max && subjectCountRange[1]) || null,
      ],
    }))
  }

  // Convert nulls to numeric values for TwoHandleRange
  const value: [number, number] = [
    searchParams.subjectCountRange[0] || min,
    searchParams.subjectCountRange[1] || max,
  ]

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab
        accordionStyle="plain"
        label="Number of Participants"
        startOpen={false}>
        <FacetRange
          min={min}
          max={max}
          step={10}
          value={value}
          onChange={setSubjectRange}
          uncappedMax
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export default SubjectCountRangeInput
