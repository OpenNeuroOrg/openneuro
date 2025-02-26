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

  // Use useMatch to identify modality paths directly
  const isModalityPath = useMatch("/search/modality/*")

  // Use useSearchParams to access query params directly
  const [searchParamsObj, setSearchParamsObj] = useSearchParams()

  const removeFilter =
    (isModality?: boolean) => (param: string, value: FilterValue): void => {
      if (isModality && param === "modality_selected") {
        removeFilterItem(setSearchParams)(param, value)

        // Access query params via searchParamsObj
        searchParamsObj.delete("modality_selected")
        searchParamsObj.set("query", "{}")

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

        searchParamsObj.delete("brain_initiative")
        searchParamsObj.set("query", "{}")

        try {
          setSearchParamsObj(searchParamsObj)
          navigate(`${globalSearchPath}?${searchParamsObj.toString()}`, {
            replace: true,
          })
        } catch (error) {
          Sentry.captureException(error)
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
      brain_initiative={searchParams.brain_initiative}
    />
  )
}

export default FiltersBlockContainer
