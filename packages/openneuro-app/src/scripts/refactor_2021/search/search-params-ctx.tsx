import React, { createContext, useState, FC, ReactNode } from 'react'
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
    case 'diagnosis_selected':
    case 'section_selected':
    case 'species_selected':
    case 'studyDomain_selected':
    case 'datePublicizedRange':
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
