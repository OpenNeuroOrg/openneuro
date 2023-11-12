import React, { FC, useContext } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  getSelectParams,
  removeFilterItem,
  SearchParamsCtx,
  useCheckIfParamsAreSelected,
} from "./search-params-ctx"
import { FiltersBlock } from "@openneuro/components/search-page"
import initialSearchParams from "./initial-search-params"

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

  const noFilters = !useCheckIfParamsAreSelected(["modality_selected"])

  const navigate = useNavigate()
  const { path } = useParams()
  const globalSearchPath = "/search"

  const removeFilter = (isModality: boolean) => (param, value): void => {
    removeFilterItem(setSearchParams)(param, value)
    if (isModality) navigate(globalSearchPath)
  }

  const removeAllFilters = (): void => {
    // reset params to default values
    setSearchParams((prevState) => ({
      ...prevState,
      ...getSelectParams(initialSearchParams),
    }))
    if (path !== globalSearchPath) navigate(globalSearchPath)
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
