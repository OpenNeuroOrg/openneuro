import React, { FC, useContext } from 'react'
import { useRouteMatch, useHistory } from 'react-router-dom'
import {
  SearchParamsCtx,
  removeFilterItem,
  useCheckIfParamsAreSelected,
} from './search-params-ctx'
import { getSelectParams } from './search-state-reducer'
import { FiltersBlock } from '@openneuro/components/search-page'
import initialSearchParams from './initial-search-params'

interface FiltersBlockContainerProps {
  numTotalResults: number
  loading: boolean
}

const FiltersBlockContainer: FC<FiltersBlockContainerProps> = ({
  numTotalResults,
  loading,
}) => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const selectedParams = getSelectParams(searchParams)

  const noFilters = !useCheckIfParamsAreSelected(['modality_selected'])

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
  return (
    <FiltersBlock
      noFilters={noFilters}
      removeFilterItem={removeFilter}
      removeAllFilters={removeAllFilters}
      numTotalResults={numTotalResults}
      {...selectedParams}
      loading={loading}
    />
  )
}

export default FiltersBlockContainer
