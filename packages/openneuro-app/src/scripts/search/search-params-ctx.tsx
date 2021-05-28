import React, { createContext, useState, FC, ReactNode } from 'react'
import { useContext } from 'react'
import { FacetListWrap } from '@openneuro/components'

const initialSearchParams = {
  selectedModality: null,
  availableModalities: [
    {
      label: 'MRI',
      value: 'mri',
      count: 30,
      children: [
        {
          label: 'Structural',
          value: 'structural',
          count: 30,
        },
        {
          label: 'Diffusional',
          value: 'diffusional',
          count: 30,
        },
      ],
    },
    {
      label: 'PET',
      value: 'pet',
      count: 30,
    },
    {
      label: 'ASL',
      value: 'asl',
      count: 30,
    },
    {
      label: 'EEG',
      value: 'eeg',
      count: 30,
    },
    {
      label: 'ECoG',
      value: 'ecog',
      count: 30,
    },
  ],
}

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
  const setModality = modality => {
    setSearchParams(prevSearchParams => ({
      ...prevSearchParams,
      selectedModality: modality,
    }))
  }

  return (
    <FacetListWrap
      items={searchParams.availableModalities}
      selected={searchParams.selectedModality}
      setSelected={setModality}
      accordionStyle="plain"
      label="modalities"
      startOpen={true}
    />
  )
}
