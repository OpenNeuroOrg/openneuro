import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
import { FacetSelect } from '@openneuro/components'

const SpeciesSelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { species_available, species_selected } = searchParams
  const setSection = species_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      species_selected,
    }))

  return (
    <FacetSelect
      selected={species_selected}
      setSelected={setSection}
      items={species_available}
      accordionStyle="plain"
      label="Species"
      startOpen={false}
    />
  )
}

export default SpeciesSelect
