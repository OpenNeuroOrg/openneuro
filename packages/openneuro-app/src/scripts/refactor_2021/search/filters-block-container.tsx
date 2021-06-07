import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
import { FiltersBlock } from '@openneuro/components'
import initialSearchParams from './initial-search-params'

const getSelectedParams = ({
  modality_selected,
  datasetType_selected,
  datasetStatus_selected,
  ageRange,
  subjectCountRange,
  seniorAuthor_selected,
  gender_selected,
  task_selected,
  diagnosis_selected,
  section_selected,
  species_selected,
  studyDomain_selected,
  datePublicizedRange,
}) => ({
  modality_selected,
  datasetType_selected,
  datasetStatus_selected,
  ageRange,
  subjectCountRange,
  seniorAuthor_selected,
  gender_selected,
  task_selected,
  diagnosis_selected,
  section_selected,
  species_selected,
  studyDomain_selected,
  datePublicizedRange,
})

const FiltersBlockContainer: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const selectedParams = getSelectedParams(searchParams)

  const someParamsAreSelected = Object.keys(selectedParams).some(key => {
    // check if a search param has been changed from it's initial value
    return (
      JSON.stringify(selectedParams[key]) !==
      JSON.stringify(initialSearchParams[key])
    )
  })

  const removeFilter = (key, value) => {
    // TODO: implement when chiclets components are done
    console.log({ key, value })
  }

  return someParamsAreSelected ? (
    <FiltersBlock removeFilter={removeFilter} {...selectedParams} />
  ) : null
}

export default FiltersBlockContainer
