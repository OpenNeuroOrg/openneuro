import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from '../search-params-ctx'
import { FacetSelect } from '@openneuro/components'

const SectionSelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { section_available, section_selected } = searchParams
  const setSection = section_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      section_selected,
    }))

  return (
    <FacetSelect
      selected={section_selected}
      setSelected={setSection}
      items={section_available}
      accordionStyle="plain"
      label="Section"
      startOpen={false}
    />
  )
}

export default SectionSelect
