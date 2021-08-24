import React, { FC, useContext } from 'react'
import { useRouteMatch, useLocation, useHistory } from 'react-router-dom'
import {
  SearchParamsCtx,
  removeFilterItem,
  getSelectParams,
  useCheckIfParamsAreSelected,
} from './search-params-ctx'
import { FiltersBlock } from '@openneuro/components/search-page'
import initialSearchParams from './initial-search-params'

interface FiltersBlockContainerProps {
  numTotalResults: number
}

const FiltersBlockContainer: FC<FiltersBlockContainerProps> = ({
  numTotalResults,
}) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const selectedParams = getSelectParams(searchParams)

  const noFilters = !useCheckIfParamsAreSelected(['modality_selected'])

  const location = useLocation()
  const history = useHistory()
  const { path } = useRouteMatch()
  const globalSearchPath = '/search'

  const removeFilter =
    (isModality: boolean) =>
    (param, value): void => {
      if (param === 'datasetType_selected' && value === 'My Datasets') {
        const query = new URLSearchParams(location.search)
        query.delete('mydatasets')
        history.replace(`${location.pathname}?${query.toString()}`)
      }
      if (param === 'datasetType_selected' && value === 'My Bookmarks') {
        const query = new URLSearchParams(location.search)
        query.delete('bookmarks')
        history.replace(`${location.pathname}?${query.toString()}`)
      }
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
  return (
    <FiltersBlock
      noFilters={noFilters}
      removeFilterItem={removeFilter}
      removeAllFilters={removeAllFilters}
      numTotalResults={numTotalResults}
      {...selectedParams}
    />
  )
}

export default FiltersBlockContainer
