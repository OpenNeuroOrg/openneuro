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
      dots={true}
      pushable={5 as unknown as undefined}
      defaultValue={[0, 20]}
      newvalue={ageRange}
      setNewValue={setAgeRange}
    />
  )
}

export default AgeRangeInput
