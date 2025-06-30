import React, { useContext } from "react"
import * as Sentry from "@sentry/react"
import type { FC } from "react"
import {
  useMatch,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom"
import {
  getSelectParams,
  removeFilterItem,
  SearchParamsCtx,
  useCheckIfParamsAreSelected,
} from "./search-params-ctx"
import { FiltersBlock } from "./components/FiltersBlock"
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

  const isModalityPath = useMatch("/search/modality/*")

  const [searchParamsObj, setSearchParamsObj] = useSearchParams()

  const removeFilter =
    (isModality?: boolean) => (param: string, value: FilterValue): void => {
      if (isModality && param === "modality_selected") {
        removeFilterItem(setSearchParams)(param, value)

        // Remove the modality_selected filter directly
        searchParamsObj.delete("modality_selected")

        // Modify `query` if we need to remove the filter from it
        const query = searchParamsObj.get("query")
        if (query) {
          try {
            const queryObj = JSON.parse(query)
            delete queryObj["modality_selected"]
            searchParamsObj.set("query", JSON.stringify(queryObj))
          } catch (error) {
            Sentry.captureException(error)
            // fallback
            searchParamsObj.delete("query")
          }
        }

        try {
          setSearchParamsObj(searchParamsObj)
          navigate(`${globalSearchPath}?${searchParamsObj.toString()}`, {
            replace: true,
          })
        } catch (error) {
          Sentry.captureException(error)
        }
      } else if (!isModalityPath && param === "brain_initiative") {
        removeFilterItem(setSearchParams)(param, value)

        // Remove the brain_initiative filter directly
        searchParamsObj.delete("brain_initiative")

        // Modify `query` if we need to remove the filter from it
        const query = searchParamsObj.get("query")
        if (query) {
          try {
            const queryObj = JSON.parse(query)
            delete queryObj["brain_initiative"]
            searchParamsObj.set("query", JSON.stringify(queryObj))
          } catch (error) {
            Sentry.captureException(error)
            // fallback
            searchParamsObj.delete("query")
          }
        }

        try {
          setSearchParamsObj(searchParamsObj)
          navigate(`${globalSearchPath}?${searchParamsObj.toString()}`, {
            replace: true,
          })
        } catch (error) {
          Sentry.captureException(error)
        }
      } else {
        // For other filters, just remove them normally
        removeFilterItem(setSearchParams)(param, value)
      }
    }

  const removeAllFilters = (): void => {
    // Reset params to default values, preserving other query params
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
