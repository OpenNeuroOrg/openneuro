import { sortBy } from '@openneuro/components'

const datasetType_available = [
  { label: 'All Public', value: 'All Public' },
  { label: 'Following', value: 'Following' },
  { label: 'My Datasets', value: 'My Datasets' },
  { label: 'My Bookmarks', value: 'My Bookmarks' },
]

const datasetStatus_available = [
  { label: 'Public', value: 'Public' },
  { label: 'Shared with Me', value: 'Shared with Me' },
  { label: 'Invalid', value: 'Invalid' },
]

const modality_available = [
  {
    label: 'MRI',
    value: 'MRI',
    count: 3000,
    children: [
      {
        label: 'Functional',
        value: 'Functional',
        count: 300,
      },
      {
        label: 'Structural',
        value: 'Structural',
        count: 200,
      },
      {
        label: 'Diffusion',
        value: 'Diffusion',
        count: 300,
      },
      {
        label: 'Perfusion',
        value: 'Perfusion',
        count: 150,
      },
    ],
  },
  {
    label: 'EEG',
    value: 'EEG',
    count: 303,
  },
  {
    label: 'IEEG',
    value: 'IEEG',
    count: 303,
    children: [
      {
        label: 'ECoG',
        value: 'ECoG',
        count: 300,
      },
      {
        label: 'SEEG',
        value: 'SEEG',
        count: 200,
      },
    ],
  },
  {
    label: 'MEG',
    value: 'MEG',
    count: 330,
  },
  {
    label: 'PET',
    value: 'PET',
    count: 30,
    children: [
      {
        label: 'Static',
        value: 'Static',
        count: 300,
      },
      {
        label: 'Dynamic',
        value: 'Dynamic',
        count: 200,
      },
    ],
  },
]

export const gender_list = [
  { label: 'All', value: 'All' },
  { label: 'Male', value: 'Male' },
  { label: 'Female', value: 'Female' },
]

export const date_list = [
  { label: 'All Time', value: 'All Time' },
  { label: 'Last 30 days', value: 'Last 30 days' },
  { label: 'Last 180 days', value: 'Last 180 days' },
  { label: 'Last 12 months', value: 'Last 12 months' },
]

type OptionalNumberRange = [number | null, number | null]

interface SearchParams {
  keywords: string[]
  datasetType_available: typeof datasetType_available
  datasetType_selected: string | null
  datasetStatus_available: typeof datasetStatus_available
  datasetStatus_selected: string | null
  modality_available: typeof modality_available
  modality_selected: string | null
  ageRange: OptionalNumberRange
  subjectCountRange: OptionalNumberRange
  diagnosis_available: string[]
  diagnosis_selected: string | null
  tasks: string[]
  authors: string[]
  // more
  gender_available: string[]
  gender_selected: string | null
  date_available: string[]
  date_selected: string | null
  species_available: string[]
  species_selected: string | null
  section_available: string[]
  section_selected: string | null
  studyDomain_available: string[]
  studyDomain_selected: string | null
  sortBy_available
  sortBy_selected
}

// TODO: move to this initial state
//       and load dynamic options on mount
const initialSearchParams: SearchParams = {
  keywords: [],
  datasetType_available,
  datasetType_selected: null,
  datasetStatus_available,
  datasetStatus_selected: null,
  modality_available,
  modality_selected: null,
  ageRange: [null, null],
  subjectCountRange: [null, null],
  diagnosis_available: [],
  diagnosis_selected: null,
  tasks: [],
  authors: [],
  // more
  gender_available: [],
  gender_selected: null,
  date_available: [],
  date_selected: null,
  species_available: [],
  species_selected: null,
  section_available: [],
  section_selected: null,
  studyDomain_available: [],
  studyDomain_selected: null,
  sortBy_available: sortBy,
  sortBy_selected: sortBy[0],
}

// TODO: delete and move to dynamically loaded initialSearchParams
const TEMPORARY_initialSearchParams: SearchParams = {
  keywords: [],
  datasetType_available,
  datasetType_selected: 'All Public',
  datasetStatus_available,
  datasetStatus_selected: null,
  modality_available,
  modality_selected: null,
  ageRange: [null, null],
  subjectCountRange: [null, null],
  diagnosis_available: ["Alzheimer's", 'Another', 'Other'],
  diagnosis_selected: null,
  tasks: [],
  authors: [],
  // more
  gender_available: ['All', 'Male', 'Female'],
  gender_selected: 'All',
  date_available: [
    'All Time',
    'Last 30 days',
    'Last 180 days',
    'Last 12 months',
  ],
  date_selected: 'All Time',
  species_available: ['Human', 'Pig', 'Rat', 'Other'],
  species_selected: null,
  section_available: ['Cross', 'Longitudinal', 'Other'],
  section_selected: null,
  studyDomain_available: ['a', 'b', 'c'],
  studyDomain_selected: null,
  sortBy_available: sortBy,
  sortBy_selected: sortBy[0],
}

export default TEMPORARY_initialSearchParams
