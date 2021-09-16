import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetSelect } from '@openneuro/components/facets'
import { AccordionTab, AccordionWrap } from '@openneuro/components/accordion'

const SectionSelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { section_available, section_selected } = searchParams
  const setSection = section_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      section_selected,
    }))

  return (
    <AccordionWrap className="modality-facet facet-accordion">
      <AccordionTab accordionStyle="plain" label="Study Type" startOpen={false}>
        <FacetSelect
          selected={section_selected}
          setSelected={setSection}
          items={section_available}
        />
      </AccordionTab>
    </AccordionWrap>
  )
}

export default SectionSelect
