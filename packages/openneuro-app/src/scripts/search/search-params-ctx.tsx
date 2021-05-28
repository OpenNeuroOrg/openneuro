import React, { createContext, useState, FC, ReactNode } from 'react'
import { useContext } from 'react'
import { FacetListWrap } from '@openneuro/components'
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

/* DEMO */
// Quick demo on container components that draw from and update the SearchParams context
//   using the display components in @openneuro/components.
// The following components are just put here for ease of access, but
//   should exist in their own files in practice.
// TODO: delete demo

interface IntermediateComponentProps {
  children: ReactNode
}
// this would be something like the SearchParamsContainer
export const IntermediateComponent: FC<IntermediateComponentProps> = ({
  children,
}) => {
  return <div className="intermediate-component">{children}</div>
}

export const ModalitySelectContainer: FC = () => {
  const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
  const setModality = value => {
    setSearchParams(prevSearchParams => {
      return {
        ...prevSearchParams,
        modality_selected: value,
      }
    })
  }

  return (
    <FacetListWrap
      items={searchParams.modality_available}
      selected={searchParams.modality_selected}
      setSelected={setModality}
      accordionStyle="plain"
      label="modalities"
      startOpen={true}
    />
  )
}
