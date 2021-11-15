import React, {
  createContext,
  useReducer,
  useContext,
  FC,
  ReactNode,
} from 'react'
import initialSearchParams from './initial-search-params'
import { searchStateCompare, searchStateReducer } from './search-state-reducer'

export const SearchParamsCtx = createContext(null)

interface SearchParamsProviderProps {
  children: ReactNode
}

export const SearchParamsProvider: FC<SearchParamsProviderProps> = ({
  children,
}) => {
  const [searchParams, dispatch] = useReducer(
    searchStateReducer,
    initialSearchParams,
  )
  return (
    <SearchParamsCtx.Provider
      value={{ searchParams, setSearchParams: dispatch }}>
      {children}
    </SearchParamsCtx.Provider>
  )
}

export const removeFilterItem = setSearchParams => (param, value) => {
  const updatedParams = {}
  switch (param) {
    /* Handle simple filter resets. */
    case 'datasetType_selected':
      // when datasetType is unset, unset datasetStatus as well
      updatedParams['datasetStatus_selected'] =
        initialSearchParams['datasetStatus_selected']
    case 'modality_selected':
    case 'datasetStatus_selected':
    case 'ageRange':
    case 'subjectCountRange':
    case 'gender_selected':
    case 'date_selected':
    case 'diagnosis_selected':
    case 'section_selected':
    case 'species_selected':
      updatedParams[param] = initialSearchParams[param]
      setSearchParams(prevState => ({
        ...prevState,
        ...updatedParams,
      }))
      break

    /* Handle removal of filters in arrays. */
    case 'keywords':
    case 'authors':
    case 'tasks':
    case 'bodyParts':
    case 'scannerManufacturers':
    case 'scannerManufacturersModelNames':
    case 'tracerNames':
    case 'tracerRadionuclides':
    case 'studyDomains':
      setSearchParams(prevState => {
        const list = prevState[param]
        const i = list.indexOf(value)
        const newList =
          i === -1 ? list : [...list.slice(0, i), ...list.slice(i + 1)]
        return {
          ...prevState,
          [param]: newList,
        }
      })
      break
  }
}

/**
 * Returns true if any search params (not in ignore) have changed from their default state.
 */
export const useCheckIfParamsAreSelected = (ignore: string[]): boolean => {
  const { searchParams } = useContext(SearchParamsCtx)
  return searchStateCompare(searchParams, initialSearchParams, ignore)
}
