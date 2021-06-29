import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
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

  return (
    <FacetRange
      startOpen={false}
      label="Number of Participants"
      accordionStyle="plain"
      min={0}
      max={100}
      step={10}
      defaultValue={[0, 20]}
      onChange={setSubjectRange}
    />
  )
}

export default SubjectCountRangeInput
