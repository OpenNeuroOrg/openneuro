import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetRadio } from '@openneuro/components/facets'
import { AccordionTab, AccordionWrap } from '@openneuro/components/accordion'

const GenderRadios: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { gender_available, gender_selected } = searchParams
  const setGender = gender_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      gender_selected,
    }))

  return (
    <AccordionWrap className="facet-accordion">
      <AccordionTab startOpen={false} label="Gender" accordionStyle="plain">
        <FacetRadio
          selected={gender_selected}
          setSelected={setGender}
          radioArr={gender_available}
          layout="row"
          name="Gender"
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export default GenderRadios
