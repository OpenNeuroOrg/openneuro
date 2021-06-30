import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetRange } from '@openneuro/components'

const AgeRangeInput: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const ageRange = searchParams.ageRange
  const setAgeRange = ageRange =>
    setSearchParams(prevState => ({
      ...prevState,
      ageRange,
    }))

  return (
    <FacetRange
      startOpen={false}
      label="Age of Participants"
      accordionStyle="plain"
      min={0}
      max={100}
      step={10}
      defaultValue={[0, 20]}
      onChange={setAgeRange}
    />
  )
}

export default AgeRangeInput
