import React, { createContext, FC, ReactNode, useContext } from "react"
import { useSearchParams } from "react-router-dom"
import initialSearchParams, { SearchParams } from "./initial-search-params"

export const SearchParamsCtx = createContext(null)

interface SearchParamsProviderProps {
  children: ReactNode
}

export const SearchParamsProvider: FC<SearchParamsProviderProps> = ({
  children,
}) => {
  const [searchQuery, setSearch] = useSearchParams()

  let searchParams
  try {
    const query = searchQuery.get("query")
    if (query) {
      searchParams = JSON.parse(query)
    }
  } catch (err) {
    console.error(err)
  }

  const setSearchParams = (
    newParams: SearchParams | ((prevState: SearchParams) => SearchParams),
  ): void => {
    const merged = typeof newParams == "function"
      ? { ...searchParams, ...newParams(searchParams) }
      : { ...searchParams, ...newParams }
    setSearch(
      {
        query: JSON.stringify(merged),
      },
      { replace: true },
    )
  }

  return (
    <SearchParamsCtx.Provider
      value={{
        searchParams: { ...initialSearchParams, ...searchParams },
        setSearchParams,
      }}
    >
      {children}
    </SearchParamsCtx.Provider>
  )
}

export const removeFilterItem = (setSearchParams) => (param, value) => {
  const updatedParams = {}
  switch (param) {
    /* Handle simple filter resets. */
    case "datasetType_selected":
      // when datasetType is unset, unset datasetStatus as well
      updatedParams["datasetStatus_selected"] =
        initialSearchParams["datasetStatus_selected"]
    case "modality_selected":
    case "datasetStatus_selected":
    case "ageRange":
    case "subjectCountRange":
    case "sex_selected":
    case "date_selected":
    case "diagnosis_selected":
    case "section_selected":
    case "species_selected":
    case "bidsDatasetType_selected":
      updatedParams[param] = initialSearchParams[param]
      setSearchParams((prevState) => ({
        ...prevState,
        ...updatedParams,
      }))
      break

    /* Handle removal of filters in arrays. */
    case "keywords":
    case "authors":
    case "tasks":
    case "bodyParts":
    case "scannerManufacturers":
    case "scannerManufacturersModelNames":
    case "tracerNames":
    case "tracerRadionuclides":
    case "studyDomains":
      setSearchParams((prevState) => {
        const list = prevState[param]
        const i = list.indexOf(value)
        const newList = i === -1
          ? list
          : [...list.slice(0, i), ...list.slice(i + 1)]
        return {
          ...prevState,
          [param]: newList,
        }
      })
      break
  }
}

/**
 * Takes an object with a superset of the following keys and
 * extracts them into a new object
 */
export const getSelectParams = ({
  keywords,
  modality_selected,
  searchAllDatasets,
  datasetType_selected,
  datasetStatus_selected,
  ageRange,
  subjectCountRange,
  authors,
  sex_selected,
  date_selected,
  tasks,
  diagnosis_selected,
  section_selected,
  species_selected,
  studyDomains,
  bodyParts,
  scannerManufacturers,
  scannerManufacturersModelNames,
  tracerNames,
  tracerRadionuclides,
  bidsDatasetType_selected,
}) => ({
  keywords,
  modality_selected,
  searchAllDatasets,
  datasetType_selected,
  datasetStatus_selected,
  ageRange,
  subjectCountRange,
  authors,
  sex_selected,
  date_selected,
  tasks,
  diagnosis_selected,
  section_selected,
  species_selected,
  studyDomains,
  bodyParts,
  scannerManufacturers,
  scannerManufacturersModelNames,
  tracerNames,
  tracerRadionuclides,
  bidsDatasetType_selected,
})

/**
 * Returns true if any search params (not in ignore) have changed from their default state.
 */
export const useCheckIfParamsAreSelected = (ignore: string[]): boolean => {
  const { searchParams } = useContext(SearchParamsCtx)
  const selectedParams = getSelectParams(searchParams)

  const someParamsAreSelected = Object.keys(selectedParams).some((key) => {
    if (ignore.includes(key)) return false
    // check if a search param has been changed from it's initial value
    else {
      return (
        JSON.stringify(selectedParams[key]) !==
          JSON.stringify(initialSearchParams[key])
      )
    }
  })
  return someParamsAreSelected
}
