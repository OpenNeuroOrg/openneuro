import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
import { FacetSelect } from '@openneuro/components'

const StudyDomainSelect: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)

  const { studyDomain_available, studyDomain_selected } = searchParams
  const setStudyDomain = studyDomain_selected =>
    setSearchParams(prevState => ({
      ...prevState,
      studyDomain_selected,
    }))

  return (
    <FacetSelect
      selected={studyDomain_selected}
      setSelected={setStudyDomain}
      items={studyDomain_available}
      accordionStyle="plain"
      label="Domain Studied/Ontology"
      startOpen={false}
    />
  )
}

export default StudyDomainSelect
