import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import initialSearchParams from '../initial-search-params'
import { FacetRange } from '@openneuro/components'

const SubjectCountRangeInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const subjectCountRange = searchParams.subjectCountRange
  const setSubjectRange = subjectCountRange => {
    setSearchParams(prevState => ({
      ...prevState,
      subjectCountRange,
    }))
  }

  const min = 0
  const max = 100
  const value =
    JSON.stringify(subjectCountRange) ===
    JSON.stringify(initialSearchParams.subjectCountRange)
      ? [min, max]
      : subjectCountRange

  return (
    <FacetRange
      startOpen={false}
      label="Number of Participants"
      accordionStyle="plain"
      min={min}
      max={max}
      step={10}
      value={value}
      onChange={setSubjectRange}
    />
  )
}

export default SubjectCountRangeInput
