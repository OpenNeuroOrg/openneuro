import React, { FC, useContext } from 'react'
import { SearchParamsCtx } from './search-params-ctx'
import { FiltersBlock } from '@openneuro/components'
import initialSearchParams from './initial-search-params'

/**
 * Takes an object with a superset of the following keys and
 * extracts them into a new object
 */
const getSelectParams = ({
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
  const selectedParams = getSelectParams(searchParams)

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

  const removeAllFilters = () => {
    // reset params to default valuse
    setSearchParams(prevState => ({
      ...prevState,
      ...getSelectParams(initialSearchParams),
    }))
  }

  return someParamsAreSelected ? (
    <FiltersBlock
      removeFilter={removeFilter}
      removeAllFilters={removeAllFilters}
      {...selectedParams}
      allTerms={[]}
      allAuthors={[]}
      allTasks={[]}
    />
  ) : null
}

export default FiltersBlockContainer
