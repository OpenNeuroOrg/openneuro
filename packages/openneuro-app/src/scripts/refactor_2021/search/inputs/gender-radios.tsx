import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetRadio } from '@openneuro/components/facets'

const GenderRadios: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { gender_available, gender_selected } = searchParams
  const setGender = gender_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      gender_selected,
    }))

  return (
    <FacetRadio
      selected={gender_selected}
      setSelected={setGender}
      radioArr={gender_available}
      layout="row"
      name="Gender"
      startOpen={false}
      label="Gender"
      accordionStyle="plain"
    />
  )
}

export default GenderRadios
