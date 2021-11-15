import initialSearchParams, { SearchParams } from './initial-search-params'

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
  gender_selected,
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
  sortBy_selected,
}) => ({
  keywords,
  modality_selected,
  searchAllDatasets,
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
  studyDomains,
  bodyParts,
  scannerManufacturers,
  scannerManufacturersModelNames,
  tracerNames,
  tracerRadionuclides,
  sortBy_selected,
})

/**
 * Test if two SearchParams are the same
 *
 * Optional ignore argument to skip comparison of some fields
 */
export const searchStateCompare = (
  a: SearchParams,
  b: SearchParams,
  ignore: string[],
): boolean => {
  const selectedParams = getSelectParams(a)

  return Object.keys(selectedParams).some(key => {
    if (ignore.includes(key)) return false
    // check if a search param has been changed from it's initial value
    else return JSON.stringify(selectedParams[key]) !== JSON.stringify(b[key])
  })
}

interface SearchActionSetSort {
  type: 'SetSort'
  value: 'relevance' | 'newest' | 'oldest' | 'activity'
}

interface SearchActionResetSort {
  type: 'ResetSort'
}

interface SearchActionReset {
  type: 'Reset'
}

interface SearchActionSetParam {
  type: 'SetParam'
  value: Partial<SearchParams>
}

export type SearchAction =
  | SearchActionSetSort
  | SearchActionSetParam
  | SearchActionReset
  | SearchActionResetSort

export const searchStateReducer = (
  prevState: SearchParams,
  action: SearchAction,
): SearchParams => {
  if (action.type === 'SetParam') {
    if (
      searchStateCompare(prevState, initialSearchParams, ['modality_selected'])
    ) {
      return {
        ...prevState,
        ...action.value,
        sortBy_selected: initialSearchParams.sortBy_available.filter(
          item => item.label === 'Relevance',
        )[0],
      }
    } else {
      return {
        ...prevState,
      }
    }
  } else if (action.type === 'Reset') {
    return initialSearchParams
  } else if (action.type === 'SetSort') {
    return { ...prevState, sortBy_selected: action.value }
  } else if (action.type === 'ResetSort') {
    return {
      ...prevState,
      sortBy_selected: initialSearchParams.sortBy_selected,
    }
  } else {
    return { ...prevState }
  }
}
