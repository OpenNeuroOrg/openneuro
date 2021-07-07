import React, {
  createContext,
  useState,
  useContext,
  FC,
  ReactNode,
} from 'react'
import initialSearchParams from './initial-search-params'

export const SearchParamsCtx = createContext(null)

interface SearchParamsProviderProps {
  children: ReactNode
}

export const SearchParamsProvider: FC<SearchParamsProviderProps> = ({
  children,
}) => {
  const [searchParams, setSearchParams] = useState(initialSearchParams)
  return (
    <SearchParamsCtx.Provider value={{ searchParams, setSearchParams }}>
      {children}
    </SearchParamsCtx.Provider>
  )
}

export const removeFilterItem = setSearchParams => (param, value) => {
  switch (param) {
    case 'modality_selected':
    case 'datasetType_selected':
    case 'datasetStatus_selected':
    case 'ageRange':
    case 'subjectCountRange':
    case 'gender_selected':
    case 'date_selected':
    case 'diagnosis_selected':
    case 'section_selected':
    case 'species_selected':
    case 'studyDomain_selected':
      setSearchParams(prevState => ({
        ...prevState,
        [param]: initialSearchParams[param],
      }))
      break
    case 'keywords':
    case 'authors':
    case 'tasks':
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
 * Takes an object with a superset of the following keys and
 * extracts them into a new object
 */
export const getSelectParams = ({
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
}: Record<string, any>): Record<string, any> => ({
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

/**
 * Returns true if any search params (not in ignore) have changed from their default state.
 */
export const useCheckIfParamsAreSelected = (ignore: string[]): boolean => {
  const { searchParams } = useContext(SearchParamsCtx)
  const selectedParams = getSelectParams(searchParams)

  const someParamsAreSelected = Object.keys(selectedParams).some(key => {
    if (ignore.includes(key)) return false
    // check if a search param has been changed from it's initial value
    else
      return (
        JSON.stringify(selectedParams[key]) !==
        JSON.stringify(initialSearchParams[key])
      )
  })
  return someParamsAreSelected
}
