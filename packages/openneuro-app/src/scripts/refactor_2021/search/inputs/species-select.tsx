import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetSelect } from '@openneuro/components/facets'
import { AccordionTab, AccordionWrap } from '@openneuro/components/accordion'

const SpeciesSelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { species_available, species_selected } = searchParams
  const setSection = species_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      species_selected,
    }))

  return (
    <AccordionWrap className="modality-facet facet-accordion">
      <AccordionTab accordionStyle="plain" label="Species" startOpen={false}>
        <FacetSelect
          selected={species_selected}
          setSelected={setSection}
          items={species_available}
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export default SpeciesSelect
