import React, { FC, useContext } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import { SearchParamsCtx, removeFilterItem } from './search-params-ctx'
import { FiltersBlock } from '@openneuro/components'
import initialSearchParams from './initial-search-params'

/**
 * Takes an object with a superset of the following keys and
 * extracts them into a new object
 */
const getSelectParams = ({
  keywords,
  modality_selected,
  datasetType_selected,
  datasetStatus_selected,
  ageRange,
  subjectCountRange,
  authors,
  gender_selected,
  date_selected,
  tasks,
  diagnosis_selected,
  section_selected,
  species_selected,
  studyDomain_selected,
}) => ({
  keywords,
  modality_selected,
  datasetType_selected,
  datasetStatus_selected,
  ageRange,
  subjectCountRange,
  authors,
  gender_selected,
  date_selected,
  tasks,
  diagnosis_selected,
  section_selected,
  species_selected,
  studyDomain_selected,
})

interface FiltersBlockContainerProps {
  numTotalResults: number
}

const FiltersBlockContainer: FC<FiltersBlockContainerProps> = ({
  numTotalResults,
}) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const selectedParams = getSelectParams(searchParams)

  const someParamsAreSelected = Object.keys(selectedParams).some(key => {
    // check if a search param has been changed from it's initial value
    return (
      JSON.stringify(selectedParams[key]) !==
      JSON.stringify(initialSearchParams[key])
    )
  })

  const history = useHistory()
  const { path } = useRouteMatch()
  const globalSearchPath = '/search'

  const removeFilter =
    (isModality: boolean) =>
    (param, value): void => {
      removeFilterItem(setSearchParams)(param, value)
      if (isModality) history.push(globalSearchPath)
    }

  const removeAllFilters = (): void => {
    // reset params to default values
    setSearchParams(prevState => ({
      ...prevState,
      ...getSelectParams(initialSearchParams),
    }))
    if (path !== globalSearchPath) history.push(globalSearchPath)
  }
  return someParamsAreSelected ? (
    <FiltersBlock
      removeFilterItem={removeFilter}
      removeAllFilters={removeAllFilters}
      numTotalResults={numTotalResults}
      {...selectedParams}
    />
  ) : null
}

export default FiltersBlockContainer
