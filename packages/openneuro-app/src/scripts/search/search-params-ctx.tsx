import React, { createContext, useState, FC, ReactNode } from 'react'
// import { useContext } from 'react'
import * as components from '@openneuro/components'
console.log(components)

const initialSearchParams = {
  modalities: [
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

// TODO: delete demo
/* DEMO */
// interface IntermediateComponentProps { children: ReactNode }
// export const IntermediateComponent: FC<IntermediateComponentProps> = ({ children }) => {
//   return (
//     <div className="intermediate-component">
//       {children}
//     </div>
//   )
// }

// interface ModalitySelectContainerProps {}
// export const ModalitySelectContainer: FC<ModalitySelectContainerProps> = () => {
//   const { searchParams, setSearchParams } = useContext(SearchParamsCtx)
//   const setModality = ()
// }
