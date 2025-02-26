import React, { useContext } from "react"
import * as Sentry from "@sentry/react"
import type { FC } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
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

  const noFilters = !useCheckIfParamsAreSelected([
    "modality_selected",
    "brain_initiative",
  ])

  const navigate = useNavigate()
  const { path } = useParams()
  const globalSearchPath = "/search"

  const [searchParamsObj, setSearchParamsObj] = useSearchParams()

  const removeFilter = () => (param: string, value: FilterValue): void => {
    removeFilterItem(setSearchParams)(param, value)

    // Parse the existing query parameter as JSON
    let queryObj = {}
    try {
      const queryParam = searchParamsObj.get("query")
      queryObj = queryParam ? JSON.parse(queryParam) : {}
    } catch (error) {
      Sentry.captureException("Failed to parse query parameter:", error)
    }

    // Remove the specific filter
    delete queryObj[param]

    // Check if there are other remaining filters
    const hasOtherFilters = Object.keys(queryObj).length > 0

    if (hasOtherFilters) {
      searchParamsObj.set("query", JSON.stringify(queryObj))
    } else {
      searchParamsObj.delete("query")
    }

    try {
      setSearchParamsObj(searchParamsObj)
      navigate(`${globalSearchPath}?${searchParamsObj.toString()}`, {
        replace: true,
      })
    } catch (error) {
      Sentry.captureException(error)
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
      brain_initiative={searchParams.brain_initiative}
    />
  )
}

export default FiltersBlockContainer
