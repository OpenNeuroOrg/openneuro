import React, { useContext } from "react"
import * as Sentry from "@sentry/react"
import type { FC } from "react"
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

type FilterValue = string | number | boolean | string[] | number[]

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

  const removeFilter =
    (isModality?: boolean) => (param: string, value: FilterValue): void => {
      if (isModality && param === "modality_selected") {
        removeFilterItem(setSearchParams)(param, value)
        const queryParams = new URLSearchParams(location.search)
        const query = queryParams.get("query")
        if (query) {
          try {
            navigate(`${globalSearchPath}?${queryParams.toString()}`, {
              replace: true,
            })
          } catch (error) {
            Sentry.captureException(error)
          }
        }
      } else {
        removeFilterItem(setSearchParams)(param, value)
      }
    }

  const removeAllFilters = (): void => {
    // reset params to default values
    setSearchParams((prevState) => ({
      ...prevState,
      ...getSelectParams(initialSearchParams),
    }))
    if (path !== globalSearchPath) navigate(globalSearchPath, { replace: true })
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
